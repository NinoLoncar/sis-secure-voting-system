let voteEnded = false;

exports.getVoteEnded = function (newValue) {
  return voteEnded;
};

exports.setVoteEnded = function (newValue) {
  voteEnded = newValue;
};
