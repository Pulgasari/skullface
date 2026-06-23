// plugins/sqlite/frontend.ts

export const execute = (stmt, vals) =>
  window.__skullface_sqlite.execute(stmt, vals);

export const query = (stmt, vals) =>
  window.__skullface_sqlite.query(stmt, vals);
