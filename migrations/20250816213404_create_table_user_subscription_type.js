const createLookupTable = require('../migration-utils/create-lookup-table');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('users').createTable('user_subscription', tbl => {
    createLookupTable(tbl);
    tbl
      .boolean('allow_mobile_events')
      .comment('Whether or not the user is allowed to create events that move around.');
    tbl.boolean('allow_templates');
    tbl
      .integer('maximum_event_size_id')
      .references('id')
      .inTable('events.event_threshold')
      .onUpdate('CASCADE')
      .comment('The maximum size of events allowed to be created.');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('users').dropTable('user_subscription');
};
