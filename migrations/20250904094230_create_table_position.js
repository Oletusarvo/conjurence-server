/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('positions').createTable('event_position', tbl => {
    tbl
      .uuid('event_id')
      .primary()
      .references('id')
      .inTable('events.event_instance')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    tbl.geography('coordinates').notNullable();
    tbl.float('accuracy');
    tbl.bigint('timestamp');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('positions').dropTable('event_position');
};
