/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('events').createTable('event_category_description', tbl => {
    tbl
      .integer('event_category_id')
      .primary()
      .references('id')
      .inTable('events.event_category')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    tbl.string('description');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('events').dropTableIfExists('event_category_description');
};
