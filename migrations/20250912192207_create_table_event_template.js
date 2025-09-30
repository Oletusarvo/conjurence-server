/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('events').createTable('event_template', tbl => {
    tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
    tbl
      .uuid('author_id')
      .notNullable()
      .references('id')
      .inTable('users.user')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    tbl
      .integer('event_category_id')
      .notNullable()
      .references('id')
      .inTable('events.event_category')
      .onUpdate('CASCADE');
    tbl
      .integer('event_threshold_id')
      .notNullable()
      .references('id')
      .inTable('events.event_size')
      .onUpdate('CASCADE');

    tbl.string('title', 32).notNullable();
    tbl.string('description', 256);
    tbl.timestamps(true, true);
    tbl.unique(['author_id', 'title', 'description']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('events').dropTable('event_template');
};
