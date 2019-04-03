const db = require("../db/connection");

exports.getComments = article_id => {
  return db
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where({ article_id: article_id });
};
