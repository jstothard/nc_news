const { getArticles } = require("../models/articles");

exports.fetchArticles = (req, res, next) => {
  getArticles().then(articles => {
    return res.status(200).send({ articles });
  });
};
