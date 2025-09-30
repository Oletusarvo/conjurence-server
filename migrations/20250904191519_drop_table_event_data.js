/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('events').dropTable('event_data');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('events').createTable('event_data', tbl => {
    tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
    tbl
      .uuid('author_id')
      .references('id')
      .inTable('users.user')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    tbl.string('title', 24);
    tbl.string('description');
    tbl.boolean('is_template').defaultTo(false);
    tbl
      .integer('event_category_id')
      .references('id')
      .inTable('events.event_category')
      .onUpdate('CASCADE');
    tbl.integer('spots_available');
  });
};
