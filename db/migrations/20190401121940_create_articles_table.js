exports.up = function(knex, Promsise) {
  return knex.schema.createTable("articles", articles => {
    articles.increments("article_id").primary();
    articles.string("title");
    articles.string("body");
    articles.integer("votes").defaultTo(0);
    articles
      .string("topic")
      .references("slug")
      .on("topics");
    articles
      .string("author")
      .references("username")
      .on("users");
    articles.date("created_at").defaultTo(knex.raw("current_date"));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("articles");
};
