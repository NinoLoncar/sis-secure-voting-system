const DatabaseHandler = require("../databaseHandler.js");

class CandidatesDao {
  constructor() {
    this.db = new DatabaseHandler("./db/database.sqlite");
  }
  getCandidates = async function () {
    this.db.connect();
    let sql = "SELECT * FROM candidates ORDER BY id";
    var data = await this.db.executeQuery(sql, []);
    this.db.disconnect();
    return data;
  };

  getCandidateById = async function (id) {
    this.db.connect();
    let sql = "SELECT * FROM candidates WHERE id = ?";
    var data = await this.db.executeQuery(sql, [id]);
    this.db.disconnect();
    if (data.length == 1) return data[0];
    else return null;
  };
}

module.exports = CandidatesDao;
