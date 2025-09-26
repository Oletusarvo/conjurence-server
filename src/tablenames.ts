type Schemas = 'users' | 'events' | 'positions';

type Tables =
  | 'user'
  | 'user_status'
  | 'user_contact'
  | 'user_contact_type'
  | 'user_subscription'
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
  | 'event_position';

const getFullTableName = <ST extends Schemas, TT extends Tables>(schema: ST, table: TT) =>
  `${schema}.${table}` as `${ST}.${TT}`;

export const tablenames = {
  user: getFullTableName('users', 'user'),
  user_status: getFullTableName('users', 'user_status'),
  user_contact: getFullTableName('users', 'user_contact'),
  user_contact_type: getFullTableName('users', 'user_contact_type'),
  user_subscription: getFullTableName('users', 'user_subscription'),
  event_instance: getFullTableName('events', 'event'),
  event_category: getFullTableName('events', 'event_category'),
  event_category_description: getFullTableName('events', 'event_category_description'),
  event_attendance: getFullTableName('events', 'event_attendance'),
  event_attendance_status: getFullTableName('events', 'event_attendance_status'),
  event_threshold: getFullTableName('events', 'event_size'),
  event_threshold_description: getFullTableName('events', 'event_size_description'),
  event_template: getFullTableName('events', 'event_template'),
  notification: getFullTableName('users', 'notification'),
  notification_type: getFullTableName('users', 'notification_type'),
  event_position: getFullTableName('positions', 'event_position'),
};
