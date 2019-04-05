const apiRouter = require("express").Router();
const { handle405 } = require("../errors");
const topicsRouter = require("./topics");
const articlesRouter = require("./articles");
const commentsRouter = require("./comments");
const usersRouter = require("./users");

apiRouter
  .route("/")
  .get((req, res) =>
    res.json({
      endpoints: {
        topics: { address: "/api/topics", methods: ["GET"] },
        aticles: { address: "/api/articles", methods: ["GET"] },
        article: {
          address: "/api/articles/:article_id",
          methods: ["GET", "PATCH"]
        },
        article_comments: {
          address: "/api/articles/:article_id/comments",
          methods: ["GET", "POST"]
        },
        comments: {
          address: "/api/comments",
          methods: ["PATCH", "DELETE"]
        },
        user: { address: "/api/users/username", methods: ["GET"] }
      }
    })
  )
  .all(handle405);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
