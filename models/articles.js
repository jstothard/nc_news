const db = require("../db/connection");

exports.getArticles = () => {
  return db
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count("articles.article_id AS comment_count")
    .groupBy("articles.article_id");
};
