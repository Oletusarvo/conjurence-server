/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return new Promise(async (resolve, reject) => {
    const [smallEventSizeId] = await knex('events.event_size')
      .where({ label: 'small' })
      .pluck('id');
    const [mediumEventSizeId] = await knex('events.event_size')
      .where({ label: 'medium' })
      .pluck('id');
    const [largeEventSize] = await knex('events.event_size').where({ label: 'large' }).pluck('id');

    await knex('users.user_subscription')
      .insert([
        {
          label: 'free',
          maximum_event_size_id: smallEventSizeId,
          allow_templates: false,
          allow_mobile_events: false,
        },
        {
          label: 'pro',
          maximum_event_size_id: mediumEventSizeId,
          allow_templates: true,
          allow_mobile_events: true,
        },
        {
          label: 'enterprise',
          maximum_event_size_id: largeEventSize,
          allow_templates: true,
          allow_mobile_events: true,
        },
      ])
      .catch(err => reject(err));
    resolve();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex('users.user_subscription').del();
};
