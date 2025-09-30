/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema('events')
    .alterTable('event_instance', tbl => {
      tbl.specificType('position', 'geography(Point, 4326)');
    })
    .then(async () => {
      //Backfill old location
      await knex.raw(`
    UPDATE events.event_instance
    SET position = ST_SetSRID(
      ST_MakePoint(
        (location->'coords'->>'longitude')::float,
        (location->'coords'->>'latitude')::float
      ),
      4326
    )::geography
  `);
    })
    .then(async () => {
      //Add a GIST index for fast proximity queries
      await knex.raw(`
    CREATE INDEX idx_events_geog ON events.event_instance USING GIST (position)
  `);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('events').alterTable('events', table => {
    table.dropColumn('position');
  });
};
