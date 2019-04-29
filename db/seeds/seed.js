const { remapDate } = require("../../utils/remap_date");
const { createArticleRef } = require("../../utils/create_article_ref");
const { remapKeys } = require("../../utils/remap_keys");
const { articles, comments, topics, users } = require("../data");
const { addVotes } = require("../../utils/add_random_votes");

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
        .insert(addVotes(remapDate(articles)))
        .returning("*");
    })
    .then(insertedArticles => {
      const reference = createArticleRef(insertedArticles);
      const commentsDate = remapDate(comments);
      const commentsRemapped = remapKeys(reference, commentsDate);
      return knex.insert(commentsRemapped).into("comments");
    });
};
