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
}

module.exports = VotesDao;
