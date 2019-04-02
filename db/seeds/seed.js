const { remapDate } = require("../../utils/remap_date");
const { createArticleRef } = require("../../utils/create_article_ref");
const { belongsToToArticleId } = require("../../utils/belongs_to_article_id");
const { articles, comments, topics, users } = require("../data");

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex("topics").insert(topics);
    })
    .then(() => {
      return knex("users").insert(users);
    })
    .then(() => {
      return knex("articles")
        .insert(remapDate(articles))
        .returning("*");
    })
    .then(insertedArticles => {
      const reference = createArticleRef(insertedArticles);
      const commentsDate = remapDate(comments);
      const commentsRemapped = belongsToToArticleId(reference, commentsDate);
      return knex.insert(commentsRemapped).into("comments");
    });
};
