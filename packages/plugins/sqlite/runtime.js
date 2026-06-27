// @skullface/plugins/sqlite/runtime.ts

import { DB } from "https://deno.land/x/sqlite/mod.ts"; // "deno:sqlite"

const dbPath = "./data.sqlite";
const db = new DB(dbPath);

export async function execute (
  statement : string, 
  values    : any[] = []
): Promise<void> {
  const query = db.prepare(statement);
  query.run(...values);
  query.finalize();
}

export async function query (
  statement : string, 
  values    : any[] = []
): Promise<any[]> {
  const query = db.prepare(statement);
  const rows = [];
  for (const row of query.iter(...values)) {
    rows.push(row);
  }
  query.finalize();
  return rows;
}
