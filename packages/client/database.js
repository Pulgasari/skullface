// @skullface/client/database.js

export const database = name => {
  const sqliteIPC = window.skullface.sqlite; // dynamic IPC-proxy
  return {
    execute: async (statement, values = []) => {
      await sqliteIPC.execute(name, statement, values);
    },
    query: async (statement, values = []) => {
      return await sqliteIPC.query(name, statement, values);
    }
  };
};

export default database;
