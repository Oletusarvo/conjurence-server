const createLookupTable = require('../migration-utils/create-lookup-table');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema('events')
    .createTable('event_attendance_status', createLookupTable)
    .createTable('event_attendance', tbl => {
      tbl
        .uuid('event_instance_id')
        .references('id')
        .inTable('events.event_instance')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl
        .uuid('user_id')
        .references('id')
        .inTable('users.user')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      tbl
        .integer('attendance_status_id')
        .notNullable()
        .references('id')
        .inTable('events.event_attendance_status')
        .onUpdate('CASCADE');

      tbl.timestamp('requested_at').defaultTo(knex.fn.now());
      tbl.timestamp('updated_at');
      tbl.primary(['event_instance_id', 'user_id']);
    })
    .then(async () => {
      await knex('events.event_attendance_status').insert([
        //Set when a user presses the I am interested-button.
        { label: 'interested' },
        //Set when a user performs the optional join-handshake with the host.
        { label: 'joined' },
        { label: 'host' },
        { label: 'canceled' },
        { label: 'pending' },
        { label: 'kicked' },
        { label: 'left' },
      ]);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema('events')
    .dropTable('event_attendance')
    .dropTable('event_attendance_status');
};
