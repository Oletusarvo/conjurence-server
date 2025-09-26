import { Knex } from 'knex';
import { TAttendance } from '../schemas/attendance-schema';
import { Repository } from '../../../util/repository';
import { tablenames } from '../../../tablenames';
import { DBContext } from '../../../db-context';
import db from '../../../../dbconfig';

export class AttendanceRepository extends Repository {
  /**Adds a .whereIn-clause to the passed query, filtering results where the attendance status is host, joined or interested. */
  protected onlyActive(query: any) {
    return query.whereIn('attendance_status.label', ['host', 'joined', 'interested']);
  }

  protected withEndingTimestamp(query: any) {
    return query.join(
      db
        .select('ended_at', 'id as instance_id_actual')
        .from(tablenames.event_instance)
        .as('instance'),
      'instance.instance_id_actual',
      'attendance.event_instance_id'
    );
  }

  protected getBaseQuery(ctx: DBContext) {
    return ctx({ attendance: tablenames.event_attendance })
      .join(
        ctx.select('username', 'id as user_id_actual').from(tablenames.user).as('user'),
        'user.user_id_actual',
        'attendance.user_id'
      )
      .join(
        ctx
          .select('id as status_id_actual', 'label')
          .from(tablenames.event_attendance_status)
          .groupBy('status_id_actual')
          .as('attendance_status'),
        'attendance_status.status_id_actual',
        'attendance.attendance_status_id'
      )
      .select(
        'attendance.event_instance_id',
        'attendance_status.label as status',
        'username',
        'requested_at',
        'updated_at'
      )
      .orderBy('attendance.requested_at', 'desc');
  }

  /**Updates an attendance by the query, and returns the updated record. */
  async updateBy({ query, payload }: { query: any; payload: any }, ctx: DBContext) {
    await ctx(tablenames.event_attendance)
      .where(query)
      .update(payload)
      .returning('event_instance_id');

    return await this.findBy(query, ctx).first();
  }

  /**Returns all attendances of a user. */
  async findByUserId(user_id: string, ctx: DBContext) {
    return await this.getBaseQuery(ctx).where({ user_id });
  }

  /**Returns all attendances on a specific event. */
  async findByEventInstanceId(event_instance_id: string, ctx: DBContext) {
    return await this.getBaseQuery(ctx).where({ event_instance_id });
  }

  /**Returns a knex query builder resolving to attendances matching the query. */
  findBy(query: any, ctx: DBContext) {
    return this.getBaseQuery(ctx).where(query);
  }

  /**Returns the current active attendance of a user, with status host, joined or interested.*/
  async findRecentActiveByUserId(user_id: string, ctx: DBContext) {
    return await this.withEndingTimestamp(
      this.onlyActive(this.getBaseQuery(ctx).where({ user_id, ended_at: null }).first())
    );
  }

  /**Returns the most recent attendance by a user regardless of its status. */
  async findRecentByUserId(user_id: string, ctx: DBContext) {
    return await this.getBaseQuery(ctx).where({ user_id }).first();
  }

  async create(
    payload: {
      user_id: string;
      event_instance_id: string;
      status: TAttendance['status'];
    },
    ctx: DBContext
  ) {
    await ctx(tablenames.event_attendance).insert({
      user_id: payload.user_id,
      event_instance_id: payload.event_instance_id,
      attendance_status_id: db(tablenames.event_attendance_status)
        .where({ label: payload.status })
        .select('id')
        .limit(1),
    });
    return await this.findBy(
      { user_id: payload.user_id, event_instance_id: payload.event_instance_id },
      ctx
    ).first();
  }
}

/**A variant of the AttendanceRepository for use in tests. Exposes protected members as public. */
export class TestAttendanceRepository extends AttendanceRepository {
  public getBaseQuery(ctx: DBContext): Knex.QueryBuilder {
    return super.getBaseQuery(ctx);
  }

  public withEndingTimestamp(query: any) {
    return super.withEndingTimestamp(query);
  }

  public onlyActive(query: any) {
    return super.onlyActive(query);
  }
}
