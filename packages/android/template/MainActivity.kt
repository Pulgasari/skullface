package dev.skullface.app

import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity
import dev.skullface.plugins.store.StorePlugin
import org.json.JSONArray
import org.json.JSONObject

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private val mobilePlugins = mutableMapOf<String, Any>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        webView = WebView(this)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        
        // 1. Register our test store plugin natively into the app container runtime
        mobilePlugins["store"] = StorePlugin(this)
        
        webView.addJavascriptInterface(WebAppInterface(), "_skullface_android_transmit")
        webView.loadUrl("file:///android_asset/www/index.html")
        setContentView(webView)
    }

    inner class WebAppInterface {
        @JavascriptInterface
        fun postMessage(messageStr: String) {
            try {
                // Parse the generic incoming skullface standard IPC message packet
                val json = JSONObject(messageStr)
                val id = json.getInt("id")
                val pluginName = json.getString("plugin")
                val method = json.getString("method")
                
                // Convert JSON arguments array to native Kotlin list array
                val jsonArgs = json.getJSONArray("args")
                val args = mutableListOf<Any>()
                for (i in 0 until jsonArgs.length()) {
                    args.add(jsonArgs.get(i))
                }

                // 2. Locate the registered plugin instance
                val plugin = mobilePlugins[pluginName]
                if (plugin == null) {
                    sendErrorToFrontend(id, "Native mobile plugin '$pluginName' not found.")
                    return
                }

                // 3. Execute method dynamically using reflection or dedicated interface mapping
                // For this test, we execute our StorePlugin directly:
                if (plugin is StorePlugin) {
                    val result = plugin.execute(method, args)
                    sendSuccessToFrontend(id, result)
                }

            } catch (e: Exception) {
                println("IPC Processing Error: ${e.message}")
            }
        }
    }

    private fun sendSuccessToFrontend(id: Int, data: Any?) {
        val response = JSONObject()
        response.put("id", id)
        response.put("success", true)
        response.put("data", data)
        
        runOnUiThread {
            webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('skullface-ipc-response', { detail: $response }));", null)
        }
    }

    private fun sendErrorToFrontend(id: Int, errorMsg: String) {
        val response = JSONObject()
        response.put("id", id)
        response.put("success", false)
        response.put("error", errorMsg)
        
        runOnUiThread {
            webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('skullface-ipc-response', { detail: $response }));", null)
        }
    }
}
