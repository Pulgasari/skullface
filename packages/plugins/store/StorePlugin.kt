package dev.skullface.plugins.store

import android.content.Context
import org.json.JSONObject
import java.io.File

class StorePlugin (private val context: Context) {
    // Memory cache mirroring the Map<String, Record<String, Any>> from api.ts
    private val cache = mutableMapOf<String, JSONObject>()

    /**
     * Main router for this specific mobile plugin
     */
    fun execute (method: String, args: List<Any>): Any? {
        val storeName = args[0] as String
        return when (method) {
            'load' -> loadStore(storeName)
            'get' -> getVal(storeName, args[1] as String)
            'set' -> setVal(storeName, args[1] as String, args[2])
            'save' -> { saveStore(storeName); true }
            else -> throw Exception("Method '$method' not supported in native Android StorePlugin.")
        }
    }

    private fun getStoreFile (storeName: String): File {
        // Matches the desktop file naming scheme: ./store_${store}.json
        return File(context.filesDir, "store_$storeName.json")
    }

    private fun loadStore (storeName: String): Map<String, Any> {
        val file = getStoreFile(storeName)
        if (!file.exists()) {
            cache[storeName] = JSONObject()
            return emptyMap()
        }
        val text = file.readText()
        val json = JSONObject(text)
        cache[storeName] = json
        
        // Convert JSONObject to standard Kotlin Map to return via IPC
        return json.keys().asSequence().associateWith { json.get(it) }
    }

    private fun saveStore (storeName: String) {
        val json = cache[storeName] ?: JSONObject()
        val file = getStoreFile(storeName)
        file.writeText(json.toString(2))
    }

    private fun getVal (storeName: String, key: string): Any? {
        val json = cache[storeName] ?: JSONObject()
        return if (json.has(key)) json.get(key) else null
    }

    private fun setVal (storeName: String, key: String, value: Any) {
        if (!cache.containsKey(storeName)) {
            cache[storeName] = JSONObject()
        }
        cache[storeName]?.put(key, value)
    }
}
