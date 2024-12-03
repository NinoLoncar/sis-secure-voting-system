const crypto = require("crypto");

exports.encrypt = function (data, publicKey) {
  const buffer = Buffer.from(data, "utf8");
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};

exports.decrypt = function (encryptedData, privateKey) {
  const buffer = Buffer.from(encryptedData, "base64");
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString("utf8");
};

exports.sign = function (data, privateKey) {
  const signer = crypto.createSign("sha256");
  signer.update(data);
  signer.end();
  const signature = signer.sign(privateKey);
  return signature.toString("base64");
};

exports.verify = function (data, signature, publicKey) {
  const verifier = crypto.createVerify("sha256");
  verifier.update(data);
  verifier.end();
  return verifier.verify(publicKey, Buffer.from(signature, "base64"));
};

module.exports = RSAHelper;
