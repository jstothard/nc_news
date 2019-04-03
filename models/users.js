const db = require("../db/connection");

exports.getUser = username => {
  return db("users")
    .select("*")
    .where({ username: username });
};
