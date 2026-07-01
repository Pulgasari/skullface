// @skullface/plugins/sqlite/frontend.ts

export interface SQLiteAPI {
  execute (statement: string, values?: any[]): Promise<void>;
  query   (statement: string, values?: any[]): Promise<any[]>;
}

declare global {
  interface Window {
    skullface: {
      sqlite: any;
    };
  }
}

/**
 * Factory function to instantiate a custom isolated SQLite database file bridge
 */
export function createDatabase (name: string): SQLiteAPI {
  // Access the central dynamic multi-platform IPC layer proxy
  const ipc = (window as any).skullface.sqlite;

  return {
    execute: async (statement: string, values: any[] = []) => {
      await ipc.execute(name, statement, values);
    },
    query: async (statement: string, values: any[] = []) => {
      return await ipc.query(name, statement, values);
    }
  };
}
