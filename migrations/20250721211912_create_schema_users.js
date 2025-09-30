const createLookupTable = require('../migration-utils/create-lookup-table');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createSchema('users')
    .withSchema('users')
    .createTable('user_status', createLookupTable)
    .createTable('user', tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl
        .integer('user_status_id')
        .notNullable()
        .references('id')
        .inTable('users.user_status')
        .onUpdate('CASCADE');
      tbl.string('email').notNullable().unique();
      tbl.string('username', 24).notNullable().unique();
      tbl.string('password').notNullable();
      tbl.timestamp('created_at').defaultTo(knex.fn.now());
      tbl.timestamp('last_active').defaultTo(knex.fn.now());
      tbl.timestamp('terms_accepted_on').notNullable();
    })
    .createTable('user_like', tbl => {
      tbl
        .uuid('from_user_id')
        .notNullable()
        .references('id')
        .inTable('users.user')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl
        .uuid('to_user_id')
        .notNullable()
        .references('id')
        .inTable('users.user')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl.primary(['from_user_id', 'to_user_id']);
    })
    .then(async () => {
      await knex('users.user_status').insert([
        { label: 'pending' },
        { label: 'deleted' },
        { label: 'active' },
      ]);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema('users')
    .dropTableIfExists('user_like')
    .dropTableIfExists('user')
    .dropTableIfExists('user_status')
    .dropSchemaIfExists('users');
};
