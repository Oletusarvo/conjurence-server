/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('users').createTable('user_rating', tbl => {
    tbl
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users.user')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    tbl
      .uuid('rater_user_id')
      .notNullable()
      .references('id')
      .inTable('users.user')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    tbl.primary(['user_id', 'rater_user_id']);
    tbl.integer('rating').checkBetween([1, 5], 'constraint_range_rating');
    tbl.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('users').dropTable('user_rating');
};
