const apiRouter = require("express").Router();
const { handle405 } = require("../errors");
const topicsRouter = require("./topics");
const articlesRouter = require("./articles");
const commentsRouter = require("./comments");
const usersRouter = require("./users");

apiRouter
  .route("/")
  .get((req, res) => res.send({ ok: true }))
  .all(handle405);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
