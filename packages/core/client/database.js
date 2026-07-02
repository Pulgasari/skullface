// @skullface/core/client/database.js

(function () {
  if (!window.skullface) window.skullface = {};
  //
  window.skullface.database = name => {
    const sqliteIPC = window.skullface.sqlite; // dynamic IPC-proxy
    return {
      execute: async (statement, values = []) => {
        await sqliteIPC.execute(name, statement, values);
      },
      query: async (statement, values = []) => {
        return await sqliteIPC.query(name, statement, values);
      }
    };
  }
  // alias
  window.skullface.db = window.skullface.database;
})();
