const articlesRouter = require("express").Router();
const { handle405 } = require("../errors");
const {
  fetchArticles,
  fetchArticle,
  updateArticle,
  removeArticle
} = require("../controllers/articles");
const { fetchComments, sendComment } = require("../controllers/comments");

articlesRouter
  .route("/:article_id/comments")
  .get(fetchComments)
  .post(sendComment)
  .all(handle405);

articlesRouter
  .route("/")
  .get(fetchArticles)
  .all(handle405);

articlesRouter
  .route("/:article_id")
  .get(fetchArticle)
  .patch(updateArticle)
  .delete(removeArticle)
  .all(handle405);

articlesRouter.all("/*", () => handle404({ status: 404 }));

module.exports = articlesRouter;
