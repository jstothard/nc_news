const {
  getArticles,
  getArticle,
  patchArticle,
  deleteArticle,
  getArticlesCount
} = require("../models/articles");
const { routeNotFound } = require("../errors");

exports.fetchArticles = (req, res, next) => {
  const articlesArray = getArticles(req.query)
    .then(articles => articles)
    .catch(next);
  const count = getArticlesCount(req.query).then(total_count => total_count);
  Promise.all([articlesArray, count]).then(arr => {
    const articles = arr[0];
    const { total_count } = arr[1];
    return res.status(200).send({ articles, total_count });
  });
};

exports.fetchArticle = (req, res, next) => {
  getArticle(req.params["article_id"])
    .then(([article]) => {
      if (article === undefined) next({ status: 404 });
      else return res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  if (
    typeof req.body.inc_votes !== "number" &&
    req.body.inc_votes !== undefined
  )
    next({
      status: 422
    });
  else {
    patchArticle(req.params["article_id"], req.body["inc_votes"])
      .then(([article]) => {
        if (article === undefined) next({ status: 404 });
        return res.status(200).send({ article });
      })
      .catch(next);
  }
};

exports.removeArticle = (req, res, next) => {
  deleteArticle(req.params["article_id"])
    .then(err => {
      if (!err) next({ status: 404 });
      else {
        return res
          .status(204)
          .send(`Article ${req.params["article_id"]} has been deleted`);
      }
    })
    .catch(next);
};
