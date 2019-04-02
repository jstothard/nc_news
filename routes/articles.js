const articlesRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { fetchArticles, fetchArticle } = require("../controllers/articles");

articlesRouter
  .route("/")
  .get(fetchArticles)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(fetchArticle)
  .all(methodNotAllowed);

module.exports = articlesRouter;
