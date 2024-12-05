const VotersDao = require("../db/daos/votersDao.js");
const VotesDao = require("../db/daos/votesDao");
const CandidateDao = require("../db/daos/candidatesDao.js");
const paillier = require("../utils/encryption/paillierEncryption.js");
const rsa = require("../utils/encryption/rsaEncryption.js");

let votersDao = new VotersDao();
let votesDao = new VotesDao();
let candidateDao = new CandidateDao();

exports.postVote = async function (req, res) {
  res.type("application/json");
  //TODO
  //validacija JWT
  let username = req.session.username; //izvaditi iz JWTa
  let voter = await votersDao.getVoterByUsername(username);
  if (voter.voted) {
    res.status(401);
    res.send(JSON.stringify({ error: "Voter has already voted" }));
    return;
  }
  let candidateId = req.body.candidate_id;
  if (!candidateId) {
    return400(res, "Missing candidate_id");
    return;
  }
  let candidate = await candidateDao.getCandidateById(candidateId);
  if (!candidate) {
    return400(res, "Invalid candidate_id");
    return;
  }
  try {
    let vote = await createEncryptedVote(candidateId);
    let signature = createSignature(vote);
    await votesDao.insertVote(vote, signature);
    await votersDao.setVotedToTrue(voter.id);
    res.status(200);
    res.send(JSON.stringify({ message: "Successful vote" }));
  } catch {
    res.status(500);
    res.send(JSON.stringify({ error: "Internal server error" }));
  }
};

function return400(res, message) {
  res.status(400);
  res.send(JSON.stringify({ error: message }));
}

async function createEncryptedVote(id) {
  let candidates = await candidateDao.getCandidates();
  let vote = "";
  let publicKey = await paillier.generatePublicKey(
    process.env.PAILLIER_PUBLIC_N,
    process.env.PAILLIER_PUBLIC_G
  );
  candidates.forEach((candidate) => {
    if (candidate.id == id) {
      vote += publicKey.encrypt(1n);
    } else {
      vote += publicKey.encrypt(0n);
    }
    vote += ".";
  });
  if (vote.length > 0) {
    vote = vote.slice(0, -1);
  }
  return vote;
}

function createSignature(text) {
  return rsa.sign(text, process.env.RSA_PRIVATE);
}
