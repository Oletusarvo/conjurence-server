/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createSchema('events')
    .withSchema('events')
    .hasTable('event_data')
    .createTable('event_data', tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl
        .uuid('author_id')
        .notNullable()
        .references('id')
        .inTable('users.user')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      tbl.string('title', 24).notNullable();
      tbl.string('description');
      tbl.boolean('is_template').defaultTo(false);
    })
    .createTable('event_instance', tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl
        .uuid('event_data_id')
        .notNullable()
        .references('id')
        .inTable('events.event_data')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

      tbl.timestamp('created_at').defaultTo(knex.fn.now());
      tbl.timestamp('ended_at');
      tbl.jsonb('location');
      tbl.integer('auto_join_threshold');
      tbl
        .integer('auto_leave_threshold')
        .comment(
          'The distance from the event a user has to be before they are automatically marked as having left.'
        );
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema('events')
    .dropTableIfExists('event_instance')
    .dropTableIfExists('event_data')
    .dropSchema('events');
};
