/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return new Promise(async (resolve, reject) => {
    try {
      const eventRecords = await knex('events.event_instance').select(
        'position',
        'position_metadata',
        'id'
      );
      await knex.transaction(async trx => {
        for (const r of eventRecords) {
          await trx('positions.event_position').insert({
            event_id: r.id,
            coordinates: r.position,
            accuracy: r.position_metadata?.accuracy || 0,
            timestamp: r.position_metadata?.timestamp || 0,
          });
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.resolve();
};
