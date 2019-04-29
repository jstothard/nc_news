// Changes created_at field to YYYY-MM-DD format

exports.addVotes = arr => {
  return arr.map(obj => {
    return { ...obj, votes: Math.round((Math.random() - 0.5) * 200) };
  });
};
