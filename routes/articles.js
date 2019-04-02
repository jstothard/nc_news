const articlesRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const {
  fetchArticles,
  fetchArticle,
  updateArticle
} = require("../controllers/articles");

articlesRouter
  .route("/")
  .get(fetchArticles)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(fetchArticle)
  .patch(updateArticle)
  .all(methodNotAllowed);

module.exports = articlesRouter;
