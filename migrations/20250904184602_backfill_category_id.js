/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return new Promise(async (resolve, reject) => {
    try {
      await knex.transaction(async trx => {
        const stream = await trx('events.event_data').select('id', 'event_category_id');
        for (const data of stream) {
          await trx('events.event_instance')
            .where({
              event_data_id: data.id,
            })
            .update({
              event_category_id: data.event_category_id,
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
