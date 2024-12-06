const VotersDao = require("../db/daos/votersDao.js");
const VotesDao = require("../db/daos/votesDao");
const CandidateDao = require("../db/daos/candidatesDao.js");
const paillier = require("../utils/encryption/paillierEncryption.js");
const rsa = require("../utils/encryption/rsaEncryption.js");
const auditLog = require("../utils/auditLog.js");

let votersDao = new VotersDao();
let votesDao = new VotesDao();
let candidateDao = new CandidateDao();
let voteLogger = auditLog.getLogger("vote");

exports.postVote = async function (req, res) {
  res.type("application/json");
  //TODO
  //validacija JWT
  let username = req.session.username; //izvaditi iz JWTa
  let voter = await votersDao.getVoterByUsername(username);
  if (voter.voted) {
    voteLogger.info(`${username} tried to vote multiple times`);
    return401(res, "Voter has already voted");
    return;
  }
  let encryptedCandidateId = req.body.candidate_id;
  if (!encryptedCandidateId) {
    voteLogger.info(`${username} sent bad request`);
    return400(res, "Missing candidate_id");
    return;
  }
  let candidateId = rsa.decrypt(encryptedCandidateId, process.env.RSA_PRIVATE);
  let candidate = await candidateDao.getCandidateById(candidateId);
  if (!candidate) {
    voteLogger.info(`${username} tried to vote for invalid candidate`);
    return400(res, "Invalid candidate_id");
    return;
  }
  try {
    let vote = await createEncryptedVote(candidateId);
    let signature = createSignature(vote);
    await votesDao.insertVote(vote, signature);
    await votersDao.setVotedToTrue(voter.id);
    voteLogger.info(`${username} successfully voted`);
    return200(res, "Successful vote");
  } catch (ex) {
    voteLogger.warn(`Error while ${username} voted: ${ex.message}`);
    return500(res);
  }
};

exports.endVote = async function (req, res) {
  try {
    res.type("application/json");
    //TODO
    //validacija JWT
    let username = req.session.username; //izvaditi iz JWTa
    voteLogger.info(`${username} started the vote count`);
    res.type("application/json");
    let publicKey = await paillier.generatePublicKey(
      process.env.PAILLIER_PUBLIC_N,
      process.env.PAILLIER_PUBLIC_G
    );

    let privateKey = await paillier.generatePrivateKey(
      process.env.PAILLIER_PRIVATE_LAMBDA,
      process.env.PAILLIER_PRIVATE_MU,
      publicKey
    );

    let candidates = await candidateDao.getCandidates();
    let voteCounts = initializeVoteCounts(candidates.length, publicKey);

    let votes = await votesDao.getVotes();
    countVotes(votes, voteCounts, publicKey);

    await saveVoteResults(candidates, voteCounts, privateKey);
    return200(res, "Vote ended");
  } catch {
    voteLogger.warn(`Error while vote counting: ${ex.message}`);
    return500(res);
  }
};

exports.getVotedStatus = async function(req, res) {
  res.type("application/json");
  let username = req.session.username;
  let voter = await votersDao.getVoterByUsername(username);
  res.status(200);
  res.send(JSON.stringify({ voted: voter.voted }));
}

exports.getRSAPublicKey = async function(req, res) {
  res.type("application/json");
  res.status(200);
  res.send(JSON.stringify({ key: process.env.RSA_PUBLIC}));
}

function return400(res, message) {
  res.status(400);
  res.send(JSON.stringify({ error: message }));
}

function return401(res, message) {
  res.status(401);
  res.send(JSON.stringify({ error: message }));
}

function return500(res) {
  res.status(500);
  res.send(JSON.stringify({ error: "Internal server error" }));
}

function return200(res, message) {
  res.status(200);
  res.send(JSON.stringify({ message: message }));
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

function initializeVoteCounts(numCandidates, publicKey) {
  return Array.from({ length: numCandidates }, () => publicKey.encrypt(0n));
}

function countVotes(votes, voteCounts, publicKey) {
  let numOfValidVoutesCounted = 0;
  votes.forEach((vote) => {
    if (verifyVote(vote)) {
      voteLogger.info(`${vote.id} - Successful signature verification`);
      addVote(vote.encrypted_vote, voteCounts, publicKey);
      voteLogger.info(`${vote.id} - Counted`);
      numOfValidVoutesCounted++;
    } else {
      voteLogger.warn(`${vote.id} - Failed signature verification`);
    }
  });
  voteLogger.info(`Counted ${numOfValidVoutesCounted} valid votes`);
}
function verifyVote(vote) {
  return rsa.verify(
    vote.encrypted_vote,
    vote.signature,
    process.env.RSA_PUBLIC
  );
}
function addVote(vote, voteCounts, publicKey) {
  let splitByDot = vote.split(".");
  splitByDot.forEach((encryptedVote, index) => {
    voteCounts[index] = publicKey.addition(
      voteCounts[index],
      BigInt(encryptedVote)
    );
  });
}
async function saveVoteResults(candidates, voteCounts, privateKey) {
  for (let i = 0; i < voteCounts.length; i++) {
    const decryptedVoteCount = privateKey.decrypt(voteCounts[i]);
    await candidateDao.saveVoteCount(
      candidates[i].id,
      Number(decryptedVoteCount)
    );
  }
}