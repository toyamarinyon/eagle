export interface Database {
  get(key: string): Promise<string>;
  query(string: string): Promise<string>;
}

let db: Database;

const Eagle = {
  setDatabase(_db: Database) {
    db = _db;
  },
  getDatabase() {
    return db;
  },
};

export { Eagle };
