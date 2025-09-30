/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return new Promise(async (resolve, reject) => {
    try {
      const currentAccuracies = await knex('events.event_instance').select(
        'id',
        'position_accuracy'
      );
      for (const { id, position_accuracy } of currentAccuracies) {
        await knex('events.event_instance')
          .where({ id })
          .update({
            position_metadata: {
              accuracy: position_accuracy,
            },
          });
      }
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
