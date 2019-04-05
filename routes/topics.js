const topicsRouter = require("express").Router();
const { handle405 } = require("../errors");
const { fetchTopics } = require("../controllers/topics");

topicsRouter
  .route("/")
  .get(fetchTopics)
  .all(handle405);

module.exports = topicsRouter;
