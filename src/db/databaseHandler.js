const SQLite = require("sqlite3").Database;

class Database {
  constructor(sqlitePath) {
    this.dbConnection = new SQLite(sqlitePath);
    this.sqlitePath = sqlitePath;
    this.dbConnection.exec("PRAGMA foreign_keys = ON;");
  }

  connect() {
    this.dbConnection = new SQLite(this.sqlitePath);
    this.dbConnection.exec("PRAGMA foreign_keys = ON;");
  }

  executeQuery(sql, data, callbackFunction) {
    this.vezaDB.all(sql, data, callbackFunction);
  }

  executeQuery(sql, data) {
    return new Promise((resolve, reject) => {
      this.vezaDB.all(sql, data, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  disconnect() {
    this.vezaDB.close();
  }
}

module.exports = Database;
