package dev.skullface.plugins.sqlite

import android.content.Context
import android.database.Cursor
import android.database.sqlite.SQLiteDatabase
import dev.skullface.app.SkullfacePlugin
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

class SQLitePlugin (private val context: Context) : SkullfacePlugin {
  // In-memory collection keeping track of separate native database connection allocations
  private val connections = mutableMapOf<String, SQLiteDatabase>()

  /**
   * Primary module gateway multiplexer forwarding JavaScript dynamic multi-argument calls
   */
  override fun execute (method: String, args: List<Any>): Any? {
    val dbName      = args[0] as String
    val statement   = args[1] as String
    val valuesArray = args[2] as JSONArray
    val db          = getDatabaseConnection(dbName)

    return when (method) {
      "execute" -> { runExecute(db, statement, valuesArray); null }
      "query"   -> runQuery(db, statement, valuesArray)
      else      -> throw Exception("Method '$method' not implemented inside Android SQLitePlugin system context.")
    }
  }

  private fun getDatabaseConnection (name: String): SQLiteDatabase {
    if (!connections.containsKey(name)) {
      val dbFile = File(context.filesDir, "data_$name.sqlite")
      dbFile.parentFile?.mkdirs()
      
      val db = SQLiteDatabase.openOrCreateDatabase(dbFile, null)
      connections[name] = db
    }
    return connections[name]!!
  }

  private fun parseArgs (valuesArray: JSONArray): Array<String> {
    val list = mutableListOf<String>()
    for (i in 0 until valuesArray.length()) {
      list.add(valuesArray.get(i).toString())
    }
    return list.toTypedArray()
  }

  private fun runExecute (db: SQLiteDatabase, statement: String, valuesArray: JSONArray) {
    val bindArgs = mutableListOf<Any>()
    for (i in 0 until valuesArray.length()) {
      bindArgs.add(valuesArray.get(i))
    }
    db.execSQL(statement, bindArgs.toTypedArray())
  }

  private fun runQuery (db: SQLiteDatabase, statement: String, valuesArray: JSONArray): JSONArray {
    val selectionArgs = parseArgs(valuesArray)
    val cursor = db.rawQuery(statement, selectionArgs)
    val responseRows = JSONArray()

    // Walk cursors index rows and compile exact Deno-matching matrix arrays
    while (cursor.moveToNext()) {
      val rowArray = JSONArray()
      for (i in 0 until cursor.columnCount) {
        when (cursor.getType(i)) {
          Cursor.FIELD_TYPE_NULL    -> rowArray.put(JSONObject.NULL)
          Cursor.FIELD_TYPE_INTEGER -> rowArray.put(cursor.getLong(i))
          Cursor.FIELD_TYPE_FLOAT   -> rowArray.put(cursor.getDouble(i))
          Cursor.FIELD_TYPE_STRING  -> rowArray.put(cursor.getString(i))
          Cursor.FIELD_TYPE_BLOB    -> rowArray.put(cursor.getBlob(i))
        }
      }
      responseRows.put(rowArray)
    }
    cursor.close()
    return responseRows
  }
}
