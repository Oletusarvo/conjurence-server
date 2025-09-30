const createLookupTable = require('../migration-utils/create-lookup-table');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema('users')
    .createTable('user_contact_type', createLookupTable)
    .createTable('user_contact', tbl => {
      tbl
        .uuid('user_id')
        .references('id')
        .inTable('users.user')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      tbl
        .integer('contact_type_id')
        .notNullable()
        .references('id')
        .inTable('users.user_contact_type')
        .onUpdate('CASCADE');
      tbl.string('contact');
      tbl.primary(['user_id', 'contact_type_id']);
    })
    .then(async () => {
      await knex('users.user_contact_type').insert([{ label: 'messenger' }, { label: 'whatsapp' }]);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema('users')
    .dropTableIfExists('user_contact')
    .dropTableIfExists('user_contact_type');
};
