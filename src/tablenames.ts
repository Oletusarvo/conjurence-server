type Schemas = 'users' | 'events' | 'positions' | 'interactions';

type Tables =
  | 'user'
  | 'user_status'
  | 'user_contact'
  | 'user_contact_type'
  | 'user_subscription'
  | 'user_interaction_type'
  | 'user_interaction'
  | 'user_rating'
  | 'event_data'
  | 'event'
  | 'event_category'
  | 'event_category_description'
  | 'event_attendance'
  | 'event_attendance_status'
  | 'event_size'
  | 'event_size_description'
  | 'event_template'
  | 'notification'
  | 'notification_type'
  | 'event_position'
  | 'activity'
  | 'event_interaction_type'
  | 'event_interaction';

const getFullTableName = <ST extends Schemas, TT extends Tables>(schema: ST, table: TT) =>
  `${schema}.${table}` as `${ST}.${TT}`;

export const tablenames = {
  user: getFullTableName('users', 'user'),
  user_status: getFullTableName('users', 'user_status'),
  user_contact: getFullTableName('users', 'user_contact'),
  user_contact_type: getFullTableName('users', 'user_contact_type'),
  user_subscription: getFullTableName('users', 'user_subscription'),
  /**@deprecated Use user_interaction instead.*/
  user_rating: getFullTableName('users', 'user_rating'),
  user_interaction_type: getFullTableName('interactions', 'user_interaction_type'),
  user_interaction: getFullTableName('interactions', 'user_interaction'),
  event_instance: getFullTableName('events', 'event'),
  event_category: getFullTableName('events', 'event_category'),
  event_category_description: getFullTableName('events', 'event_category_description'),
  event_attendance: getFullTableName('events', 'event_attendance'),
  event_attendance_status: getFullTableName('events', 'event_attendance_status'),
  event_threshold: getFullTableName('events', 'event_size'),
  event_threshold_description: getFullTableName('events', 'event_size_description'),
  /**@deprecated Use activity instead. */
  event_template: getFullTableName('events', 'event_template'),
  notification: getFullTableName('users', 'notification'),
  notification_type: getFullTableName('users', 'notification_type'),
  event_position: getFullTableName('positions', 'event_position'),
  activity: getFullTableName('events', 'activity'),
  event_interaction: getFullTableName('events', 'event_interaction'),
  event_interaction_type: getFullTableName('events', 'event_interaction_type'),
};
