const db = require("../db/connection");

exports.getComments = (
  article_id,
  { sort_by = "created_at", order = "desc" }
) => {
  const columns = ["comment_id", "votes", "created_at", "author", "body"];
  const sortBy = columns.includes(sort_by) ? sort_by : "created_at";
  const orderCheck = (order === "asc") | (order === "desc") ? order : "desc";
  return db
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where({ article_id })
    .orderBy(sortBy, orderCheck);
};

exports.postComment = (article_id, author, body) => {
  return db("comments")
    .insert({ article_id, author, body })
    .returning("*");
};

exports.patchComment = (comment_id, inc_votes = 0) => {
  return db("comments")
    .where({ comment_id })
    .modify(builder => {
      if (inc_votes) builder.increment("votes", inc_votes);
    })
    .returning("*");
};

exports.deleteComment = comment_id => {
  return db("comments")
    .where({ comment_id })
    .del();
};
