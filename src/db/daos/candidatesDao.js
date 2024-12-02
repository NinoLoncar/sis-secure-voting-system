const DatabaseHandler = require("../databaseHandler.js");

class CandidatesDao {
  constructor() {
    this.db = new DatabaseHandler("./db/database.sqlite");
  }
  getCandidates = async function () {
    this.db.connect();
    let sql = "SELECT * FROM candidates";
    var data = await this.db.executeQuery(sql, []);
    this.db.disconnect();
    return data;
  };
}

module.exports = CandidatesDao;
