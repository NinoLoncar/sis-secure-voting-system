const paillierBigint = require("paillier-bigint");

async function generateKeys(bitLength = 2048) {
  return paillierBigint.generateRandomKeys(bitLength);
}

function encrypt(number, publicKey) {
  return publicKey.encrypt(number);
}

function decrypt(encryptedNumber, privateKey) {
  return privateKey.decrypt(encryptedNumber);
}

function add(encryptedNum1, encryptedNum2, publicKey) {
  return publicKey.addition(encryptedNum1, encryptedNum2);
}

function multiply(encryptedNum, scalar, publicKey) {
  return publicKey.multiply(encryptedNum, scalar);
}

module.exports = { generateKeys, encrypt, decrypt, add, multiply };
