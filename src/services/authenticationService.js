const UserDAO = require("../db/daos/votersDao.js");
const bycript = require("../utils/encryption/bcryptHasher.js");
const nodemailer = require("../utils/nodemailer.js");
const auditLog = require("../utils/auditLog.js");
const jwt = require("../utils/jwt.js");

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

  let accountLockedUntil = new Date(existingUser.account_locked_until + "Z");
  if (new Date() < accountLockedUntil) {
    return423(res, "Account temporarily locked");
    return;
}
  let validPassword = await bycript.verifyPassword(
    userData.password,
    existingUser.password
  );

  if (validPassword) {
    let message = `${req.ip} Successful login with username ${userData.username}`;
    log(message);
    
    await userDao.resetFailedLoginAttempts(existingUser.id);
    
    req.session.username = userData.username;
    res.status(200);
    res.send(JSON.stringify({ message: "Successful login" }));
  } else {
    let message = `${req.ip} Failed login with username ${userData.username}`;
    log(message);
    let isAccountLocked = await handleFailedLoginAttempts(existingUser);
    if (!isAccountLocked)
      return401(res, "Wrong credentials");
    else
      return423(res, "Account temporarily locked")
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

exports.sendTwoFactorAuthCode = async function (req, res) {
  res.type("application/json");

  if (req.session.code) {
    res
      .status(204)
      .send(JSON.stringify({ message: "Code already sent to email" }));
    return;
  }

  try {
    await sendMail(req);
    res.status(200).send(JSON.stringify({ message: "Code sent to email" }));
    return;
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.checkTwoFactorAuthCode = async function (req, res) {
  res.type("application/json");

  let userTwoFactorCode = req.body.code;
  let storedTwoFactorCode = req.session.code;
  if (userTwoFactorCode == storedTwoFactorCode) {
    req.session.verified = true;

    let token = jwt.generateJwtToken(
      req.session.username,
      process.env.JWT_SECRET,
      process.env.JWT_VALIDITY
    );

    res
      .status(200)
      .json({ message: "Successful two factor authentication", jwt: token });
  } else {
    req.session.destroy(() => {});
    return401(res, "Two factor authentication failed");
  }
};

async function handleFailedLoginAttempts(user) {
  let userDao = new UserDAO();
  user = await userDao.incrementFailedLoginAttempts(user.id);
  if (user.failed_login_attempts == 5) {
    await userDao.setAccountLockedUntil(user.id);
    await userDao.resetFailedLoginAttempts(user.id);
    return true;
  }
  return false;
}

function return400(res, message) {
  res.status(400);
  res.send(JSON.stringify({ error: message }));
}

function return401(res, message) {
  res.status(401);
  res.send(JSON.stringify({ error: message }));
}

function return423(res, message) {
  res.status(423);
  res.send(JSON.stringify({ error: message }));
}

async function sendMail(req) {
  let userDao = new UserDAO();
  let username = req.session.username;
  let user = await userDao.getVoterByUsername(username);

  let code = generateRandomCodeNumber();
  req.session.code = code;

  await nodemailer.sendMail(
    process.env.EMAIL,
    `${user.email}`,
    "SVS - 2FA Code",
    `Your code: ${code}`
  );
}

function generateRandomCodeNumber() {
  let code = Math.floor(100000 + Math.random() * 900000);
  return code;
}

function log(message) {
  logger.info(message);
}
