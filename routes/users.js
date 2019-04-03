const usersRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { fetchUser } = require("../controllers/users");

usersRouter
  .route("/:username")
  .get(fetchUser)
  .all(methodNotAllowed);

module.exports = usersRouter;
