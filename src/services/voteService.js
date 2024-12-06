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
    return401(res, "Voter has already voted");
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
    return200(res, "Successful vote");
  } catch {
    return500(res);
  }
};

exports.endVote = async function (req, res) {
  try {
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
    return500(res);
  }
};

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
  votes.forEach((vote) => {
    if (verifyVote(vote)) {
      addVote(vote.encrypted_vote, voteCounts, publicKey);
      console.log("Dobar potpis");
    } else {
      console.log("Krivi potpis");
    }
  });
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
