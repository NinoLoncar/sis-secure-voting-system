const crypto = require("crypto");

exports.encrypt = function (data, publicKey) {
  const buffer = Buffer.from(data, "utf8");
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};

exports.decrypt = function (encryptedData, privateKey) {
  const pemKey = `-----BEGIN RSA PRIVATE KEY-----\n${privateKey}\n-----END RSA PRIVATE KEY-----`;
  const privateKeyBuffer = Buffer.from(pemKey, "utf8");  
  const buffer = Buffer.from(encryptedData, "base64");
  const decrypted = crypto.privateDecrypt(privateKeyBuffer, buffer);
  return decrypted.toString("utf8");
};

exports.sign = function (data, privateKey) {
  const pemKey = `-----BEGIN RSA PRIVATE KEY-----\n${privateKey}\n-----END RSA PRIVATE KEY-----`;
  const privateKeyBuffer = Buffer.from(pemKey, "utf8");
  const signer = crypto.createSign("sha256");
  signer.update(data);
  signer.end();
  const signature = signer.sign(privateKeyBuffer);
  return signature.toString("base64");
};

exports.verify = function (data, signature, publicKey) {
  const pemKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
  const publicKeyBuffer = Buffer.from(pemKey, "utf8");
  const verifier = crypto.createVerify("sha256");
  verifier.update(data);
  verifier.end();
  return verifier.verify(publicKeyBuffer, Buffer.from(signature, "base64"));
};
