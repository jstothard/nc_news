const commentsRouter = require("express").Router();
const { handle405 } = require("../errors");
const { updateComment, removeComment } = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .patch(updateComment)
  .delete(removeComment)
  .all(handle405);

module.exports = commentsRouter;
