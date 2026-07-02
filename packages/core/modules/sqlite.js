// @skullface/core/modules/sqlite.js

import { DB } from 'https://deno.land/x/sqlite/mod.ts';

// :::::: CACHE

// Local cache connection pool map managing multiple open database instances
const connections = new Map ();

// :::::: HELPERS

/**
 * Lazily opens or retrieves an active SQLite connection from the pool
 */
function getDB (name) {
  if (!connections.has(name)) {
    // Resolve standard secure application data layout storage target path
    const globalPaths = globalThis.skullface.paths;
    const dbPath      = globalPaths.join(globalPaths.app.data, `${name}.sqlite`);
    
    // Ensure the enclosing application support system folders exist before mounting
    globalPaths.ensureExists(globalPaths.app.data);

    connections.set(name, new DB(dbPath));
  }
  return connections.get(name);
}

// :::::: API

export default {
  
  async execute (name, statement, values = []) {
    const db       = getDB(name);
    const prepared = db.prepare(statement);
    prepared.run(...values);
    prepared.finalize();
  },

  async query (name, statement, values = []) {
    const db       = getDB(name);
    const prepared = db.prepare(statement);
    const result   = [];
    
    // Map individual row values array snapshots into the response wire buffer
    for (const row of prepared.iter(...values)) {
      result.push(row);
    }
    
    prepared.finalize();
    return result;
  }
  
};
