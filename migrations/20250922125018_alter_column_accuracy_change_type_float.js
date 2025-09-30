/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('positions').alterTable('event_position', tbl => {
    tbl.float('accuracy').alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('positions').alterTable('event_position', tbl => {
    tbl.integer('accuracy').alter();
  });
};
