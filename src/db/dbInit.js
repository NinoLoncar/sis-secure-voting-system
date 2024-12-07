const DatabaseHandler = require("./databaseHandler.js");
const fs = require("fs");

let filePath = "./db/script.sql";
db = new DatabaseHandler("./db/database.sqlite");
exports.initDb = async function () {
  let sqlScript = fs.readFileSync(filePath, "utf-8");
  const sqlCommands = sqlScript
    .split(";")
    .map((cmd) => cmd.trim())
    .filter((cmd) => cmd.length > 0);

  db.connect();
  for (const sql of sqlCommands) {
    await db.executeQuery(sql, []);
  }
  await createVoters();
  db.disconnect();
};

async function createVoters() {
  let userEmail = process.env.USER_EMAIL || process.env.EMAIL;
  for (let i = 1; i < 100; i++) {
    let sql =
      "INSERT INTO voters (username, email, password, voted) VALUES " +
      `('voter${i}', '${userEmail}', '$2b$10$q34qg3bxNTPgoMO.ahHqRuYC3HGA1Dh.NevUTDLsMH2r.vffMTctu', FALSE);`;
    await db.executeQuery(sql, []);
  }
}
