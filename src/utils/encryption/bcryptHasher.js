const bcrypt = require("bcrypt");

exports.hashPassword = async function (plainPassword) {
  try {
    const hash = await bcrypt.hash(plainPassword, 10);
    return hash;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw err;
  }
};

exports.verifyPassword = async function (plainPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (err) {
    console.error("Error verifying password:", err);
    throw err;
  }
};
