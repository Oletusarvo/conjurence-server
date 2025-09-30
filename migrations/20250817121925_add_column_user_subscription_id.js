/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('users').alterTable('user', tbl => {
    tbl
      .integer('user_subscription_id')
      .references('id')
      .inTable('users.user_subscription')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('users').alterTable('user', tbl => {
    tbl.dropColumn('user_subscription_id');
  });
};
