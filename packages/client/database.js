// @skullface/client/database.js

export const database = name => {
  const sqliteIPC = window.skullface.sqlite; // dynamic IPC-proxy
  return {
    execute: async (statement, values = []) => {
      //await window.skullface.sqlite.execute(name, statement, values);
      await window.skullface.ipc('database.execute', { name, statement, values })
    },
    query: async (statement, values = []) => {
      //return await sqliteIPC.query(name, statement, values);
      return await window.skullface.ipc('database.query', { name, statement, values });
    }
  };
};

export default database;
