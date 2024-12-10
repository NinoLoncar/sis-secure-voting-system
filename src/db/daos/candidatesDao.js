const DatabaseHandler = require("../databaseHandler.js");

class CandidatesDao {
  constructor() {
    this.db = new DatabaseHandler("./db/database.sqlite");
  }
  getCandidates = async function () {
    this.db.connect();
    let sql = "SELECT * FROM candidates ORDER BY id";
    let data = await this.db.executeQuery(sql, []);
    this.db.disconnect();
    return data;
  };

  getCandidateById = async function (id) {
    this.db.connect();
    let sql = "SELECT * FROM candidates WHERE id = ?";
    let data = await this.db.executeQuery(sql, [id]);
    this.db.disconnect();
    if (data.length == 1) return data[0];
    else return null;
  };

  getCandidatesCount = async function () {
    this.db.connect();
    let sql = "SELECT COUNT(*) AS candidateCount FROM candidates";
    let result = await this.db.executeQuery(sql, []);
    this.db.disconnect();
    return result[0].candidateCount;
  };
  saveVoteCount = async function (id, count) {
    this.db.connect();
    let sql = "UPDATE candidates SET vote_count = ? WHERE id = ?;";
    await this.db.executeQuery(sql, [count, id]);
    this.db.disconnect();
  };
}

module.exports = CandidatesDao;
