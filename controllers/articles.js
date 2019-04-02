const {
  getArticles,
  getArticle,
  patchArticle,
  deleteArticle
} = require("../models/articles");

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

exports.removeArticle = (req, res, next) => {
  deleteArticle(req.params["article_id"]).then(() => {
    return res
      .status(204)
      .send(`Article ${req.params["article_id"]} has been deleted`);
  });
};
