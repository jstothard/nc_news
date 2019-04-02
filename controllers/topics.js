const { getTopics } = require("../models/topics");

exports.fetchTopics = (req, res, next) => {
  getTopics().then(topics => {
    return res.status(200).send({ topics });
  });
};
