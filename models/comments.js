const db = require("../db/connection");

exports.getComments = article_id => {
  return db
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where({ article_id });
};

exports.postComment = (article_id, author, body) => {
  return db("comments")
    .insert({ article_id, author, body })
    .returning(["author", "body"]);
};
