const commentsRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { updateComment } = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .patch(updateComment)
  .all(methodNotAllowed);

module.exports = commentsRouter;
