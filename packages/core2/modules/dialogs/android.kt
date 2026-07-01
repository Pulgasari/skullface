package dev.skullface.plugins.dialogs

import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Looper
import dev.skullface.app.SkullfacePlugin
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.CountDownLatch

class DialogsPlugin(private val context: Context) : SkullfacePlugin {

  /**
   * Primary polymorphic gateway router mapping out dynamic JavaScript calls
   */
  override fun execute (method: String, args: List<Any>): Any? {
    return when (method) {
      "showMessage" -> {
        val options = args[0] as JSONObject
        showNativeAlert(options.optString("title", "Message"), options.getString("body"), false)
        null
      }
      "showError" -> {
        val options = args[0] as JSONObject
        showNativeAlert(options.optString("title", "Error"), options.getString("body"), true)
        null
      }
      "showConfirm" -> {
        val options = args[0] as JSONObject
        showNativeConfirm(options.optString("title", "Confirm"), options.getString("body"))
      }
      "pickFile"         -> "${context.filesDir.absolutePath}/mock_document.txt"
      "pickFiles"        -> JSONArray().apply { put("${context.filesDir.absolutePath}/mock_document.txt") }
      "pickFolder"       -> context.filesDir.absolutePath
      "pickSaveLocation" -> "${context.filesDir.absolutePath}/saved_output.json"
      else               -> throw Exception("Method '$method' not implemented inside Android DialogsPlugin context.")
    }
  }

  private fun showNativeAlert (title: String, body: String, isError: Boolean) {
    // Android alert components must be instantiated on the main application Looper thread
    Handler(Looper.getMainLooper()).post {
      val builder = AlertDialog.Builder(context)
        .setTitle(title)
        .setMessage(body)
        .setPositiveButton("OK", null)
      
      if (isError) {
        builder.setIcon(android.R.drawable.ic_delete)
      }
      builder.show()
    }
  }

  private fun showNativeConfirm (title: String, body: String): Boolean {
    var confirmResult = false
    val latch         = CountDownLatch(1)

    // Bridge asynchronous mobile window drawing mechanics to synchronous framework loops
    Handler(Looper.getMainLooper()).post {
      AlertDialog.Builder(context)
        .setTitle(title)
        .setMessage(body)
        .setPositiveButton("OK") { _, _ ->
          confirmResult = true
          latch.countDown()
        }
        .setNegativeButton("Cancel") { _, _ ->
          confirmResult = false
          latch.countDown()
        }
        .setOnCancelListener {
          confirmResult = false
          latch.countDown()
        }
        .show()
    }

    try {
      latch.await() // Hold the pipeline execution thread until the smartphone user selects an action
    } catch (e: InterruptedException) {
      return false
    }

    return confirmResult
  }
}
