const UserDAO = require("../db/daos/votersDao.js");
const bycript = require("../utils/encryption/bcryptHasher.js");

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
    return401(res);
    return;
  }

  let validPassword = bycript.verifyPassword(
    userData.password,
    existingUser.password
  );

  if (validPassword) {
    //TODO
    // Kreiranje sesije i JWT-a
    req.session.username = userData.username;
    res.status(200);
    res.send(JSON.stringify({ message: "Successful login" }));
  } else {
    return401(res);
  }
};

exports.logout = async function (req, res) {
  req.session.destroy(() => {
    res.redirect("/");
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
