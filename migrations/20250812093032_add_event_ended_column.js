/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema('events')
    .alterTable('event_attendance', tbl => {
      tbl.boolean('event_ended').defaultTo(false);
    })
    .then(async () => {
      //Backfill true on entries that point to an event where ended_at is not null.
      const endedEventIds = await knex('events.event_instance')
        .whereNotNull('ended_at')
        .pluck('id');
      for (const id of endedEventIds) {
        await knex('events.event_attendance').where({ event_instance_id: id }).update({
          event_ended: true,
        });
      }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('events').alterTable('event_attendance', tbl => {
    tbl.dropColumn('event_ended');
  });
};
