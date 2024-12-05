const DatabaseHandler = require("../databaseHandler.js");

class VoterDao {
  constructor() {
    this.db = new DatabaseHandler("./db/database.sqlite");
  }
  getVoterByUsername = async function (username) {
    this.db.connect();
    let sql = "SELECT * FROM voters WHERE username=?;";
    var data = await this.db.executeQuery(sql, [username]);
    this.db.disconnect();
    if (data.length == 1) return data[0];
    else return null;
  };

  setVotedToTrue = async function (id) {
    this.db.connect();
    let sql = "UPDATE voters SET voted = TRUE WHERE id = ?;";
    await this.db.executeQuery(sql, [id]);
    this.db.disconnect();
  };
}

module.exports = VoterDao;
