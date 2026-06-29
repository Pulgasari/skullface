package dev.skullface.plugins.external

import android.content.Context
import android.content.Intent
import android.net.Uri
import dev.skullface.app.SkullfacePlugin
import java.io.File

class ExternalPlugin (private val context: Context) : SkullfacePlugin {

  /**
   * Primary module gateway multiplexer routing incoming JavaScript shell requests
   */
  override fun execute (method: String, args: List<Any>): Any? {
    return when (method) {
      "file"   -> { openFile(args[0] as String); null }
      "url"    -> { openURL(args[0] as String); null }
      "reveal" -> { revealFile(args[0] as String); null }
      else     -> throw Exception("Method '$method' not implemented inside Android ExternalPlugin context.")
    }
  }

  private fun openURL (url: String) {
    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
    context.startActivity(intent)
  }

  private fun openFile (path: String) {
    val file = if (path.startsWith("/")) File(path) else File(context.filesDir, path)
    val uri = Uri.fromFile(file)
    
    val intent = Intent(Intent.ACTION_VIEW).apply {
      setDataAndType(uri, "*/*") // Let Android automatically pick the best viewer app
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
    }
    context.startActivity(intent)
  }

  private fun revealFile (path: String) {
    val file   = if (path.startsWith("/")) File(path) else File(context.filesDir, path)
    val folder = file.parentFile ?: context.filesDir
    val uri    = Uri.fromFile(folder)
    
    val intent = Intent(Intent.ACTION_VIEW).apply {
      setDataAndType(uri, "resource/folder")
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
    
    try {
      context.startActivity(intent)
    } catch (e: Exception) {
      // Fallback intent routing if custom file manager apps reject folder content types
      val backupIntent = Intent(Intent.ACTION_VIEW, uri).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      context.startActivity(backupIntent)
    }
  }
}
