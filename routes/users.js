const usersRouter = require("express").Router();
const { handle405 } = require("../errors");
const { fetchUser } = require("../controllers/users");

usersRouter
  .route("/:username")
  .get(fetchUser)
  .all(handle405);

module.exports = usersRouter;
