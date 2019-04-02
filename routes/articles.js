const articlesRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { fetchArticles } = require("../controllers/articles");

articlesRouter
  .route("/")
  .get(fetchArticles)
  .all(methodNotAllowed);

module.exports = articlesRouter;
