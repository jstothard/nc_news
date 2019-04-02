const { getArticles, getArticle } = require("../models/articles");

exports.fetchArticles = (req, res, next) => {
  getArticles().then(articles => {
    return res.status(200).send({ articles });
  });
};

exports.fetchArticle = (req, res, next) => {
  getArticle(req.params["article_id"]).then(([article]) => {
    return res.status(200).send({ article });
  });
};
