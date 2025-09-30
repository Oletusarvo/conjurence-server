/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('users').createTable('user_stat', tbl => {
    tbl
      .uuid('user_id')
      .primary()
      .references('id')
      .inTable('users.user')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    tbl
      .integer('events_attended')
      .comment(
        'The number of times the user has joined an event and either stayed to the end, or left during it.'
      )
      .defaultTo(0);
    tbl.integer('events_hosted').defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('users').dropTable('user_stat');
};
