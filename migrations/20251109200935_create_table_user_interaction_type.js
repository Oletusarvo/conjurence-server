const createLookupTable = require('../migration-utils/create-lookup-table');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema('interactions')
    .createTable('user_interaction_type', createLookupTable);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('interactions').dropTable('user_interaction_type');
};
