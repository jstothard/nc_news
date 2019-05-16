exports.addVotes = arr => {
  return arr.map(obj => {
    return { ...obj, votes: Math.round((Math.random() - 0.5) * 200) };
  });
};
