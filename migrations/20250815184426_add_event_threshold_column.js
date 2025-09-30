/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('events').alterTable('event_instance', tbl => {
    tbl
      .integer('event_threshold_id')
      .references('id')
      .inTable('events.event_threshold')
      .onUpdate('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('events').alterTable('event_instance', tbl => {
    tbl.dropColumn('event_threshold_id');
  });
};
