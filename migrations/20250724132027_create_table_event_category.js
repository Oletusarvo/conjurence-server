const createLookupTable = require('../migration-utils/create-lookup-table');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema('events')
    .createTable('event_category', createLookupTable)
    .alterTable('event_data', tbl => {
      tbl
        .integer('event_category_id')
        .references('id')
        .inTable('events.event_category')
        .onUpdate('CASCADE');
    })
    .then(async () => {
      await knex('events.event_category').insert([
        { label: 'game' },
        { label: 'hangout' },
        { label: 'other' },
      ]);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema('events')
    .alterTable('event_data', tbl => {
      tbl.dropColumn('event_category_id');
    })
    .dropTableIfExists('event_category');
};
