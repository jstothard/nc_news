const db = require("../db/connection");

exports.getComments = (
  article_id,
  { sort_by = "created_at", order = "desc" }
) => {
  return db
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where({ article_id })
    .orderBy(sort_by, order);
};

exports.postComment = (article_id, author, body) => {
  return db("comments")
    .insert({ article_id, author, body })
    .returning("*");
};

exports.patchComment = (comment_id, inc_votes) => {
  return db("comments")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*");
};

exports.deleteComment = comment_id => {
  return db("comments")
    .where({ comment_id })
    .del();
};
