const db = require("../db/connection");

exports.getArticles = ({ sort_by = "created_at", order = "desc" }) => {
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
    .groupBy("articles.article_id")
    .orderBy(sort_by, order);
};

exports.getArticle = article_id => {
  return db
    .select(
      "articles.author",
      "title",
      "articles.body",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .rightJoin("comments", "articles.article_id", "comments.article_id")
    .count("articles.article_id AS comment_count")
    .groupBy("articles.article_id")
    .where({ "articles.article_id": article_id });
};

exports.patchArticle = (article_id, inc_votes) => {
  return db
    .select(
      "articles.author",
      "title",
      "articles.body",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .rightJoin("comments", "articles.article_id", "comments.article_id")
    .count("articles.article_id AS comment_count")
    .groupBy("articles.article_id")
    .where({ "articles.article_id": article_id })
    .increment("votes", inc_votes)
    .returning("*");
};

exports.deleteArticle = article_id => {
  return db
    .select("*")
    .from("articles")
    .where({ "articles.article_id": article_id })
    .del();
};
