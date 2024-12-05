const DatabaseHandler = require("../databaseHandler.js");

class VotesDao {
  constructor() {
    this.db = new DatabaseHandler("./db/database.sqlite");
  }
  getVotes = async function () {
    this.db.connect();
    let sql = "SELECT * FROM votes";
    var data = await this.db.executeQuery(sql, []);
    this.db.disconnect();
    return data;
  };

  insertVote = async function (vote, signature) {
    this.db.connect();
    let sql = "INSERT INTO votes (vote, signature) VALUES (?, ?)";
    var data = await this.db.executeQuery(sql, [vote, signature]);
    this.db.disconnect();
  };
}

module.exports = VotesDao;
