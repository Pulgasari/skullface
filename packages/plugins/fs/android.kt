package dev.skullface.plugins.fs

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

class FileSystemPlugin (private val context: Context) {

  /**
   * Main router filtering incoming JavaScript framework action calls
   */
  fun execute (method: String, args: List<Any>): Any? {
    return when (method) {
      "readText"  -> readText(args[0] as String)
      "writeText" -> { writeText(args[0] as String, args[1] as String); null }
      "readJSON"  -> readJSON(args[0] as String)
      "writeJSON" -> { writeJSON(args[0] as String, args[1]); null }
      "exists"    -> exists(args[0] as String)
      "copy"      -> { copy(args[0] as String, args[1] as String); null }
      "remove"    -> { remove(args[0] as String); null }
      "mkdir"     -> { mkdir(args[0] as String); null }
      "walk"      -> walk(args[0] as String)
      else        -> throw Exception("Method '$method' not supported inside Android FileSystemPlugin context.")
    }
  }

  private fun resolvePath (path: String): File {
    // If the path is relative, sandbox it inside the app's internal secure storage directory
    return if (path.startsWith("/")) File(path) else File(context.filesDir, path)
  }

  private fun readText (path: String): String {
    return resolvePath(path).readText()
  }

  private fun writeText (path: String, text: String) {
    val file = resolvePath(path)
    file.parentFile?.mkdirs()
    file.writeText(text)
  }

  private fun readJSON (path: String): JSONObject {
    val text = readText(path)
    return JSONObject(text)
  }

  private fun writeJSON (path: String, obj: Any) {
    val file = resolvePath(path)
    file.parentFile?.mkdirs()
    val jsonString = if (obj is JSONObject) obj.toString(2) else obj.toString()
    file.writeText(jsonString)
  }

  private fun exists (path: String): Boolean {
    return resolvePath(path).exists()
  }

  private fun copy (src: String, dest: String) {
    val srcFile  = resolvePath(src)
    val destFile = resolvePath(dest)
    destFile.parentFile?.mkdirs()
    srcFile.copyTo(destFile, overwrite = true)
  }

  private fun remove (path: String) {
    val file = resolvePath(path)
    if (file.isDirectory) {
      file.deleteRecursively()
    } else {
      file.delete()
    }
  }

  private fun mkdir (path: String) {
    resolvePath(path).mkdirs()
  }

  private fun walk (path: String): JSONArray {
    val directory = resolvePath(path)
    val array = JSONArray()
    
    if (directory.exists() && directory.isDirectory) {
      directory.listFiles()?.forEach { file ->
        val entry = JSONObject()
        entry.put("name", file.name)
        entry.put("isFile", file.isFile)
        entry.put("isDirectory", file.isDirectory)
        entry.put("isSymlink", false) // Standard Java File API does not track symlinks natively
        array.put(entry)
      }
    }
    return array
  }
}
