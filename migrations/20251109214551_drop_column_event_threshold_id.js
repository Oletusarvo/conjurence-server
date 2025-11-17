/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('events').alterTable('activity', tbl => {
    tbl.dropColumn('event_threshold_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('events').alterTable('activity', tbl => {
    tbl
      .integer('event_threshold_id')
      .references('id')
      .inTable('events.event_threshold')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');
  });
};
