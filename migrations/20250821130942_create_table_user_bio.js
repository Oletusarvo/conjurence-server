/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('users').createTable('user_bio', tbl => {
    tbl
      .uuid('user_id')
      .primary()
      .references('id')
      .inTable('users.user')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    tbl.text('content');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('users').dropTable('user_bio');
};
