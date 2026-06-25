// plugins/sqlite/runtime.ts

export function injectRuntime (ctx) {
  const target = `${ctx.paths.backend}/sqlite.runtime.js`;
  Deno.writeTextFileSync(target, RUNTIME_CODE);
}

const RUNTIME_CODE = `
import { DB } from "deno:sqlite";

(function() {
  // Default DB path
  const dbPath = "./data.sqlite";

  const db = new DB(dbPath);

  const api = {
    execute(statement, values = []) {
      const query = db.prepare(statement);
      query.run(...values);
      query.finalize();
    },

    query(statement, values = []) {
      const query = db.prepare(statement);
      const rows = [];
      for (const row of query.iter(...values)) {
        rows.push(row);
      }
      query.finalize();
      return rows;
    }
  };

  globalThis.__skullface_sqlite = api;
})();
`;
