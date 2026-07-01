package dev.skullface.plugins.hotkeys

import dev.skullface.app.SkullfacePlugin

class HotkeysPlugin : SkullfacePlugin {
  /**
   * Primary module gateway pipeline routing structural shortcut events
   */
  override fun execute (method: String, args: List<Any>): Any? {
    // Hardware shortcuts operate inside the active viewport context thread natively
    return null
  }
}
