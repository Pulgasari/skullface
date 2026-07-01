package dev.skullface.plugins.clipboard

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import dev.skullface.app.SkullfacePlugin
import org.json.JSONObject

class ClipboardPlugin (private val context: Context) : SkullfacePlugin {
    private val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager

    /**
     * Entry pipeline router mapping out incoming JavaScript string invokes
     */
    override fun execute (method: String, args: List<Any>): Any? {
        return when (method) {
            "copy"     -> { copyText(args[0] as String); null }
            "paste"    -> pasteText()
            "copyHTML" -> { copyHTML(args[0] as String); null }
            "copyJSON" -> { copyJSON(args[0]); null }
            else       -> throw Exception("Method '$method' not implemented inside Android ClipboardPlugin context.")
        }
    }

    private fun copyText (text: String) {
        val clip = ClipData.newPlainText("skullface_text", text)
        clipboard.setPrimaryClip(clip)
    }

    private fun pasteText (): String {
        val clip = clipboard.primaryClip
        if (clip != null && clip.itemCount > 0) {
            val text = clip.getItemAt(0).text
            if (text != null) {
                return text.toString()
            }
        }
        return ""
    }

    private fun copyHTML (html: String) {
        // Enforce safe semantic HTML clipping formatting configurations 
        val clip = ClipData.newHtmlText("skullface_html", html, html)
        clipboard.setPrimaryClip(clip)
    }

    private fun copyJSON (obj: Any) {
        val jsonString = if (obj is JSONObject) obj.toString(2) else obj.toString()
        val clip = ClipData.newPlainText("skullface_json", jsonString)
        clipboard.setPrimaryClip(clip)
    }
}
