/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('interactions').createTable('user_interaction', tbl => {
    tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
    tbl
      .uuid('to_user_id')
      .notNullable()
      .references('id')
      .inTable('users.user')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    tbl
      .uuid('from_user_id')
      .references('id')
      .inTable('users.user')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');
    tbl
      .integer('interaction_type_id')
      .notNullable()
      .references('id')
      .inTable('interactions.user_interaction_type')
      .onUpdate('CASCADE');
    tbl.jsonb('metadata');
    tbl.timestamps(true, true);
    tbl.unique(['to_user_id', 'from_user_id', 'interaction_type_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('interactions').dropTable('user_interaction');
};
