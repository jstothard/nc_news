const articlesRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const {
  fetchArticles,
  fetchArticle,
  updateArticle,
  removeArticle
} = require("../controllers/articles");
const { fetchComments } = require("../controllers/comments");

articlesRouter
  .route("/:article_id/comments")
  .get(fetchComments)
  .all(methodNotAllowed);

articlesRouter
  .route("/")
  .get(fetchArticles)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(fetchArticle)
  .patch(updateArticle)
  .delete(removeArticle)
  .all(methodNotAllowed);

module.exports = articlesRouter;
