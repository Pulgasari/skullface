// @skullface/client/database.js

export const database = name => {
  return {
    execute: async (statement, values = []) => {
      await window.skullface.ipc('database.execute', { name, statement, values })
    },
    query: async (statement, values = []) => {
      return await window.skullface.ipc('database.query', { name, statement, values });
    }
  };
};

export default database;
