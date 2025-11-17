/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('events').alterTable('event', tbl => {
    tbl
      .uuid('activity_id')
      .references('id')
      .inTable('events.activity')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('events').alterTable('event', tbl => {
    tbl.dropColumn('activity_id');
  });
};
