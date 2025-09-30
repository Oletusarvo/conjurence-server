const createLookupTable = require('../migration-utils/create-lookup-table');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema('events')
    .createTable('event_threshold', tbl => {
      createLookupTable(tbl);
      tbl.integer('auto_join_threshold').notNullable();
      tbl.integer('auto_leave_threshold').notNullable();
    })
    .createTable('event_threshold_description', tbl => {
      tbl
        .integer('event_threshold_id')
        .primary()
        .references('id')
        .inTable('events.event_threshold')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl.string('description').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema('events')
    .dropTableIfExists('event_threshold_description')
    .dropTableIfExists('event_threshold');
};
