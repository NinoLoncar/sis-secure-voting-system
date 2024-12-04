const CandidateDAO = require("../db/daos/candidatesDao.js");

exports.getCandidates = async function (req, res) {
    let candidateDao = new CandidateDAO();
    let candidates = await candidateDao.getCandidates();
    res.status(200).json(candidates);
};
