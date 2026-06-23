export interface SQLiteAPI {
  execute (statement: string, values?: any[]): void;
  query   (statement: string, values?: any[]): any[];
}
