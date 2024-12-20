const DatabaseHandler = require("../databaseHandler.js");

class VotesDao {
  constructor() {
    this.db = new DatabaseHandler("./db/database.sqlite");
  }
  getVotes = async function () {
    this.db.connect();
    let sql = "SELECT * FROM votes";
    let data = await this.db.executeQuery(sql, []);
    this.db.disconnect();
    return data;
  };

  insertVote = async function (vote, signature) {
    this.db.connect();
    let sql = "INSERT INTO votes (encrypted_vote, signature) VALUES (?, ?)";
    await this.db.executeQuery(sql, [vote, signature]);
    this.db.disconnect();
  };
}

module.exports = VotesDao;
