package dev.skullface.plugins.router

import dev.skullface.app.SkullfacePlugin

class RouterPlugin : SkullfacePlugin {
  /**
   * Primary module gateway pipeline tracking router actions
   */
  override fun execute (method: String, args: List<Any>): Any? {
    // Component route callbacks are processed locally inside the frontend WebView context
    return null
  }
}
