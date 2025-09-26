import { tablenames } from '../../../tablenames';
import { Repository } from '../../../util/repository';

export abstract class EventMetaRepository extends Repository {
  /**Returns a query resolving to the category of an event, with
   * column alias:
   * id - category_id_actual,
   * label - category
   *
   * table alias:
   * category
   */
  protected getCategorySubquery = ctx => {
    return ctx
      .select('id as category_id_actual', 'label as category')
      .from(tablenames.event_category)
      .as('category');
  };

  protected getSizeSubQuery = ctx => {
    return ctx(tablenames.event_threshold)
      .select('auto_join_threshold', 'auto_leave_threshold', 'id as threshold_id', 'label as size')
      .groupBy('id')
      .as('event_threshold');
  };

  /**Returns a query resolving to the number of users currently present at an event. */
  protected getPresentCountSubQuery = ctx => {
    return ctx
      .select('event_instance_id')
      .count('* AS attendance_count')
      .from(tablenames.event_attendance)
      .whereIn(
        'attendance_status_id',
        ctx
          .select('id')
          .from(tablenames.event_attendance_status)
          .whereIn('label', ['joined', 'host'])
      )
      .groupBy('event_instance_id')
      .as('present_count');
  };

  /**Returns a query resolving to the number of users who attended an event, are interested in it, or left. */
  protected getParticipantCountSubQuery = ctx => {
    return ctx
      .select('event_instance_id')
      .count('* AS interested_count')
      .from(tablenames.event_attendance)
      .whereIn(
        'attendance_status_id',
        ctx
          .select('id AS ap_status_id')
          .from(tablenames.event_attendance_status)
          .whereIn('label', ['interested', 'joined', 'left'])
      )
      .groupBy('event_instance_id')
      .as('participant_count');
  };

  protected getHostUserSubQuery = ctx => {
    return ctx({ attendance: tablenames.event_attendance })
      .join(
        ctx
          .select('id as user_id_actual', 'username')
          .from(tablenames.user)
          //.groupBy('user_id_actual', 'username')
          .as('user'),
        'user.user_id_actual',
        'attendance.user_id'
      )
      .select('user.username', 'attendance.user_id', 'attendance.event_instance_id')
      .as('host');
  };

  protected getPositionSubQuery = ctx => {
    return ctx
      .select('event_id', 'accuracy', 'coordinates', 'timestamp')
      .from(tablenames.event_position)
      .groupBy('event_id')
      .as('position');
  };
}
