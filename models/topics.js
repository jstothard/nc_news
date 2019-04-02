const db = require("../db/connection");

exports.getTopics = () => {
  return db.select("*").from("topics");
};
