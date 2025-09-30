/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex('events.event_instance').update({
    event_threshold_id: knex
      .select('id')
      .from('events.event_threshold')
      .where({ label: 'small' })
      .limit(1),
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
