package dev.skullface.plugins.notifications

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import dev.skullface.app.SkullfacePlugin
import org.json.JSONObject

class NotificationsPlugin (private val context: Context) : SkullfacePlugin {
  private val channelId = "skullface_notifications_channel"

  init {
    createNotificationChannel()
  }

  /**
   * Primary module gateway pipeline filtering system notification hooks
   */
  override fun execute (method: String, args: List<Any>): Any? {
    return when (method) {
      "requestPermission" -> true // Managed automatically on target client application layers
      "notify" -> {
        val optionsObj = args[0] as JSONObject
        sendNotification(optionsObj)
        null
      }
      else -> throw Exception("Method '$method' not supported inside Android NotificationsPlugin context.")
    }
  }

  private fun createNotificationChannel () {
    // Notification channels are strictly required starting from Android 8.0 (Oreo) onwards
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val name            = "Skullface Notifications"
      val descriptionText = "Default channel for Skullface runtime app notifications"
      val importance      = NotificationManager.IMPORTANCE_DEFAULT
      val channel         = NotificationChannel(channelId, name, importance).apply { description = descriptionText }
      val manager         = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      manager.createNotificationChannel(channel)
    }
  }

  private fun sendNotification (options: JSONObject) {
    val body  = options.optString("body", "")
    val title = options.optString("title", "Skullface App")
    
    // Resolves the host applications layout resource icon dynamically
    val appIconResId = context.applicationInfo.icon

    val builder = NotificationCompat.Builder(context, channelId)
      .setSmallIcon(appIconResId)
      .setContentTitle(title)
      .setContentText(body)
      .setPriority(NotificationCompat.PRIORITY_DEFAULT)
      .setAutoCancel(true)

    val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    
    // Dispatch using a unique timestamp signature ID to prevent notification collision
    manager.notify(System.currentTimeMillis().toInt(), builder.build())
  }
}
