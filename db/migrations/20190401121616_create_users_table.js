exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", users => {
    users.string("username").primary();
    users.string("avatar_url");
    users.string("name");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
