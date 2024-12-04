const UserDAO = require("../db/daos/votersDao.js");
const bycript = require("../utils/encryption/bcryptHasher.js");
const auditLog = require("../utils/auditLog.js");
let logger = auditLog.getLogger("Auth");
exports.login = async function (req, res) {
  let userDao = new UserDAO();
  let userData = req.body;
  res.type("application/json");

  if (!userData.username || !userData.password) {
    return400(res, "Missing password or username");
    return;
  }

  let existingUser = await userDao.getVoterByUsername(userData.username);

  if (!existingUser) {
    let message = `${req.ip} Failed login with non-existent username ${userData.username}`;
    log(message);
    return401(res);
    return;
  }

  let validPassword = await bycript.verifyPassword(
    userData.password,
    existingUser.password
  );

  if (validPassword) {
    let message = `${req.ip} Successful login with username ${userData.username}`;
    log(message);
    //TODO
    // Kreiranje sesije i JWT-a
    req.session.username = userData.username;
    res.status(200);
    res.send(JSON.stringify({ message: "Successful login" }));
  } else {
    let message = `${req.ip} Failed login with username ${userData.username}`;
    log(message);
    return401(res);
  }
};

exports.logout = async function (req, res) {
  if (req.session.username) {
    let message = `${req.ip} Logout ${req.session.username}`;
    log(message);
  }
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

function return400(res, message) {
  res.status(400);
  res.send(JSON.stringify({ error: message }));
}

function return401(res) {
  res.status(401);
  res.send(JSON.stringify({ error: "Wrong credentials" }));
}

function log(message) {
  logger.info(message);
}
