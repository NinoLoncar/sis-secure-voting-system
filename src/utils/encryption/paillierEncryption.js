const paillierBigint = require("paillier-bigint");

async function generatePublicKey(n, g) {
  return new paillierBigint.PublicKey(BigInt(n), BigInt(g));
}

async function generatePrivateKey(lambda, mu, publicKey) {
  return new paillierBigint.PrivateKey(BigInt(lambda), BigInt(mu), publicKey);
}

module.exports = {
  generatePublicKey,
  generatePrivateKey,
};
