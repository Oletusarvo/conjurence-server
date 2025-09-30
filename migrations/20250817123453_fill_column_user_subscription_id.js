/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex('users.user').update({
    user_subscription_id: knex
      .select('id')
      .from('users.user_subscription')
      .where({ label: 'free' })
      .limit(1),
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
