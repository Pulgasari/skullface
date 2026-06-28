package com.skullface.app

import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
  private lateinit var webView: WebView

  override fun onCreate (savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
        
    webView = WebView(this)
    webView.settings.javaScriptEnabled = true
    webView.settings.domStorageEnabled = true
        
    // Bind the native communication handler wire under the exact bridge target identifier
    webView.addJavascriptInterface(WebAppInterface(), "_skullface_android_transmit")
        
    webView.webViewClient = object : WebViewClient() {
      override fun onPageFinished(view: WebView?, url: String?) {
        super.onPageFinished(view, url)
        // Synchronously seed device system paths directly into the browser context memory
        injectPaths()
      }
    }
        
    // Load the compiled frontend bundle index file located inside the native asset package
    webView.loadUrl("file:///android_asset/www/index.html")
    setContentView(webView)
  }

    private fun injectPaths () {
        val cacheDir = cacheDir.absolutePath
        val filesDir = filesDir.absolutePath
        
        // Replicate the exact desktop skullface.paths JSON mapping structure
        val pathsJson = """
            window.__skullface_paths__ = {
                home  : '$filesDir',
                cache : '$cacheDir',
                temp  : '$cacheDir/tmp',
                app   : {
                    cache  : '$cacheDir',
                    config : '$filesDir/config',
                    data   : '$filesDir/data',
                    logs   : '$filesDir/logs'
                }
            };
        """.trimIndent()
        
        webView.evaluateJavascript(pathsJson, null)
    }

    inner class WebAppInterface {
        @JavascriptInterface
        fun postMessage(messageStr: String) {
            // This function replaces Deno's ipc.ts logic entirely on the native mobile layer
            // Triggered whenever the frontend proxy fires an invoke command request
            println("Received IPC command payload from Skullface Frontend: $messageStr")
            
            // Inside a complete module setup, this string maps out to Kotlin execution routines
        }
    }
}
