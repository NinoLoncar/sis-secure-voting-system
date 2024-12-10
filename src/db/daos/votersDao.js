const DatabaseHandler = require("../databaseHandler.js");

class VoterDao {
  constructor() {
    this.db = new DatabaseHandler("./db/database.sqlite");
  }
  getVoterByUsername = async function (username) {
    this.db.connect();
    let sql = "SELECT * FROM voters WHERE username=?;";
    let data = await this.db.executeQuery(sql, [username]);
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

  incrementFailedLoginAttempts = async function (id) {
    this.db.connect();
    let sql = "UPDATE voters SET failed_login_attempts = failed_login_attempts + 1 WHERE id = ?;";
    await this.db.executeQuery(sql, [id]);
    sql = "SELECT * FROM voters WHERE id = ?;";
    let data = await this.db.executeQuery(sql, [id]);
    this.db.disconnect();
    return data[0];
  };

  resetFailedLoginAttempts = async function (id) {
    this.db.connect();
    let sql = "UPDATE voters SET failed_login_attempts = 0 WHERE id = ?;";
    await this.db.executeQuery(sql, [id]);
    this.db.disconnect();
  };

  setAccountLockedUntil = async function (id) {
    this.db.connect();
    let sql = "UPDATE voters SET account_locked_until = DATETIME('now', '+30 minute') WHERE id = ?;";
    await this.db.executeQuery(sql, [id]);
    this.db.disconnect();
  };
}

module.exports = VoterDao;
