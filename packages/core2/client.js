// @skullface/core/client.js

// Factory function to instantiate a custom isolated SQLite database file bridge
export function createDatabase (name) {
  return {
    execute: async (statement, values = []) => {
      await window.skullface.sqlite.execute(name, statement, values);
    },
    query: async (statement, values = []) => {
      return await window.skullface.sqlite.query(name, statement, values);
    }
  };
}
