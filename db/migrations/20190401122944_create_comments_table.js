exports.up = function(knex, Promise) {
  return knex.schema.createTable("comments", comments => {
    comments.increments("comment_id").primary();
    comments
      .string("author")
      .references("username")
      .on("users");
    comments
      .integer("article_id")
      .references("article_id")
      .on("articles");
    comments.integer("votes").defaultsTo(0);
    comments.date("created_at").defaultsTo(knex.fn.now());
    comments.string("body");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("comments");
};
