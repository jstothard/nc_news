exports.up = function(knex, Promise) {
  return knex.schema.createTable("topics", topics => {
    topics.string("slug").primary();
    topics.string("desription");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("topics");
};
