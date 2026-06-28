package dev.skullface.plugins.store

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

class StorePlugin (private val context: Context) {
    // Memory cache mirroring the Map<String, Record<String, Any>> state structure
    private val cache = mutableMapOf<String, JSONObject>()

    /**
     * Core orchestrator routing every incoming IPC command payload
     */
    fun execute (method: String, args: List<Any>): Any? {
        val storeName = args[0] as String
        ensureCache(storeName)

        return when (method) {
            "load"    -> loadStore(storeName)
            "save"    -> { saveStore(storeName); null }
            "get"     -> getVal(storeName, args[1] as String)
            "set"     -> { setVal(storeName, args[1] as String, args[2]); null }
            "remove"  -> { removeVal(storeName, args[1] as String); null }
            "clear"   -> { clearStore(storeName); null }
            "all"     -> allStore(storeName)
            "entries" -> entriesStore(storeName)
            "keys"    -> keysStore(storeName)
            "values"  -> valuesStore(storeName)
            "has"     -> hasVal(storeName, args[1] as String)
            "size"    -> sizeStore(storeName)
            "update"  -> { updateStore(storeName, args[1] as JSONObject); null }
            else -> throw Exception("Method '$method' not implemented in native Android StorePlugin.")
        }
    }

    private fun getStoreFile (storeName: String): File {
        // Matches the exact filename pattern: ./store_${store}.json
        return File(context.filesDir, "store_$storeName.json")
    }

    private fun ensureCache (storeName: String) {
        if (!cache.containsKey(storeName)) {
            val file = getStoreFile(storeName)
            if (file.exists()) {
                try {
                    cache[storeName] = JSONObject(file.readText())
                } catch (e: Exception) {
                    cache[storeName] = JSONObject()
                }
            } else {
                cache[storeName] = JSONObject()
            }
        }
    }

    private fun loadStore (storeName: String): JSONObject {
        val file = getStoreFile(storeName)
        val json = if (file.exists()) JSONObject(file.readText()) else JSONObject()
        cache[storeName] = json
        return json
    }

    private fun saveStore (storeName: String) {
        val json = cache[storeName] ?: JSONObject()
        val file = getStoreFile(storeName)
        file.writeText(json.toString(2))
    }

    private fun getVal (storeName: String, key: String): Any? {
        val json = cache[storeName]!!
        return if (json.has(key)) json.get(key) else null
    }

    private fun setVal (storeName: String, key: String, value: Any) {
        cache[storeName]!!.put(key, value)
    }

    private fun removeVal (storeName: String, key: String) {
        cache[storeName]!!.remove(key)
    }

    private fun clearStore (storeName: String) {
        cache[storeName] = JSONObject()
    }

    private fun allStore (storeName: String): JSONObject {
        // Return a copy of the current storage record
        return JSONObject(cache[storeName]!!.toString())
    }

    private fun keysStore (storeName: String): JSONArray {
        val json = cache[storeName]!!
        val array = JSONArray()
        json.keys().forEach { array.put(it) }
        return array
    }

    private fun valuesStore (storeName: String): JSONArray {
        val json = cache[storeName]!!
        val array = JSONArray()
        json.keys().forEach { array.put(json.get(it)) }
        return array
    }

    private fun entriesStore (storeName: String): JSONArray {
        val json = cache[storeName]!!
        val outArray = JSONArray()
        json.keys().forEach { key ->
            val entry = JSONArray()
            entry.put(key)
            entry.put(json.get(key))
            outArray.put(entry)
        }
        return outArray
    }

    private fun hasVal (storeName: String, key: String): Boolean {
        return cache[storeName]!!.has(key)
    }

    private fun sizeStore (storeName: String): Int {
        return cache[storeName]!!.length()
    }

    private fun updateStore (storeName: String, data: JSONObject) {
        val json = cache[storeName]!!
        data.keys().forEach { key ->
            val value = data.get(key)
            // If value matches undefined/null representation, clean out the property entry key
            if (value == null || value == JSONObject.NULL) {
                json.remove(key)
            } else {
                json.put(key, value)
            }
        }
    }
}
