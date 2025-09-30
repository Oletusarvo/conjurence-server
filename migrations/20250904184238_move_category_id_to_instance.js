/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('events').alterTable('event_instance', tbl => {
    tbl
      .integer('event_category_id')
      .references('id')
      .inTable('events.event_category')
      .onUpdate('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('events').alterTable('event_instance', tbl => {
    tbl.dropColumn('event_category_id');
  });
};
