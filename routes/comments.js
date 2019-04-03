const commentsRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { updateComment, removeComment } = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .patch(updateComment)
  .delete(removeComment)
  .all(methodNotAllowed);

module.exports = commentsRouter;
