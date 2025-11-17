/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('interactions').createTable('event_interaction', tbl => {
    tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
    tbl
      .uuid('event_id')
      .notNullable()
      .references('id')
      .inTable('events.event')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    tbl
      .uuid('user_id')
      .references('id')
      .inTable('users.user')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');
    tbl
      .integer('interaction_type_id')
      .notNullable()
      .references('id')
      .inTable('interactions.event_interaction_type')
      .onUpdate('CASCADE');
    tbl.jsonb('metadata');

    tbl.timestamps(true, true);
    tbl.unique(['event_id', 'user_id', 'interaction_type_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('interactions').dropTable('event_interaction');
};
