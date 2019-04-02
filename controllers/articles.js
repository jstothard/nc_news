const { getArticles, getArticle, patchArticle } = require("../models/articles");

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

exports.updateArticle = (req, res, next) => {
  patchArticle(req.params["article_id"], req.body["inc_votes"]).then(
    ([article]) => {
      return res.status(200).send({ article });
    }
  );
};
