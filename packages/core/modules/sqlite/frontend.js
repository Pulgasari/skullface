// @skullface/plugins/sqlite/frontend.js

// Factory function to instantiate a custom isolated SQLite database file bridge
export function createDatabase (name) {
  // Access the central dynamic multi-platform IPC layer proxy
  const ipc = window.skullface.sqlite;

  return {
    execute: async (statement, values = []) => {
      await ipc.execute(name, statement, values);
    },
    query: async (statement, values = []) => {
      return await ipc.query(name, statement, values);
    }
  };
}
