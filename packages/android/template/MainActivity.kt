package dev.skullface.app

import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity
import dev.skullface.plugins.clipboard.ClipboardPlugin
import dev.skullface.plugins.fs.FileSystemPlugin
import dev.skullface.plugins.store.StorePlugin
import org.json.JSONObject

class MainActivity : AppCompatActivity() {
  private lateinit var webView: WebView
  private val mobilePlugins = mutableMapOf<String, Any>()

  override fun onCreate (savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
        
    webView = WebView(this)
    webView.settings.javaScriptEnabled = true
    webView.settings.domStorageEnabled = true
        
    // Register the unified StorePlugin into the local device runtime ecosystem
    mobilePlugins["clipboard"] =  ClipboardPlugin(this)
    mobilePlugins["fs"]        = FileSystemPlugin(this)
    mobilePlugins["store"]     =      StorePlugin(this)
        
    webView.addJavascriptInterface(WebAppInterface(), "_skullface_android_transmit")
    webView.loadUrl("file:///android_asset/www/index.html")
    setContentView(webView)
  }

  inner class WebAppInterface {
    @JavascriptInterface
    fun postMessage(messageStr: String) {
      try {
        val json       = JSONObject(messageStr)
        val id         = json.getInt("id")
        val pluginName = json.getString("plugin")
        val method     = json.getString("method")
                
        // Unpack variable-length array payload arguments safely
        val jsonArgs = json.getJSONArray("args")
        val args     = mutableListOf<Any>()
        for (i in 0 until jsonArgs.length()) {
          args.add(jsonArgs.get(i))
        }

        val plugin = mobilePlugins[pluginName]
        if (plugin == null) {
          sendErrorToFrontend(id, "Native mobile plugin '$pluginName' not found.")
          return
        }

        // Handle routing execution target loops
        if (pluginName == "clipboard" && plugin is ClipboardPlugin) {
          val result = plugin.execute(method, args)
          sendSuccessToFrontend(id, result)
        }
        if (pluginName == "fs" && plugin is FileSystemPlugin) {
          val result = plugin.execute(method, args)
          sendSuccessToFrontend(id, result)
        }
        if (plugin is StorePlugin && pluginName == "store") {
          val result = plugin.execute(method, args)
          sendSuccessToFrontend(id, result)
        }
        
      } catch (e: Exception) {
        println("IPC Execution Fault: ${e.message}")
      }
    }
  }

  private fun sendSuccessToFrontend (id: Int, data: Any?) {
    val response = JSONObject()
    response.put("id", id)
    response.put("success", true)
    response.put("data", data)
        
    runOnUiThread {
      webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('skullface-ipc-response', { detail: $response }));", null)
    }
  }

  private fun sendErrorToFrontend (id: Int, errorMsg: String) {
    val response = JSONObject()
    response.put("id", id)
    response.put("success", false)
    response.put("error", errorMsg)
        
    runOnUiThread {
      webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('skullface-ipc-response', { detail: $response }));", null)
    }
  }
}
