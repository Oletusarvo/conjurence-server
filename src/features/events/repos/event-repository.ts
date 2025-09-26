import { Knex } from 'knex';

import z from 'zod';
import { createEventSchema, updateEventSchema } from '../schemas/event-schema';

import { EventMetaRepository } from './event-meta-repository';
import { DBContext } from '../../../db-context';
import { tablenames } from '../../../tablenames';
import { Repository } from '../../../util/repository';
import { createGeographyRow } from '../../geolocation/util/create-geography-row';

export class EventRepository extends EventMetaRepository {
  public getBaseQuery(ctx: DBContext) {
    //Get the host username.
    const hostUserSubQuery = this.getHostUserSubQuery(ctx);
    //Get the event size settings.
    const thresholdsQuery = this.getSizeSubQuery(ctx);
    //Get interested users count.
    const participantCountSubquery = this.getParticipantCountSubQuery(ctx);
    //Get attendant count
    const presentCountSubquery = this.getPresentCountSubQuery(ctx);
    //Get the event category label.
    const eventCategorySubquery = this.getCategorySubquery(ctx);
    const positionSubquery = this.getPositionSubQuery(ctx);

    const q = ctx({ event: tablenames.event_instance })
      .join(positionSubquery, 'position.event_id', 'event.id')
      .join(hostUserSubQuery, 'host.event_instance_id', 'event.id')
      .leftJoin(participantCountSubquery, 'participant_count.event_instance_id', 'event.id')
      .leftJoin(presentCountSubquery, 'present_count.event_instance_id', 'event.id')
      .leftJoin(thresholdsQuery, 'event_threshold.threshold_id', 'event.event_threshold_id')
      .join(eventCategorySubquery, 'category.category_id_actual', 'event.event_category_id')
      .select(
        'event.author_id',
        'event.title',
        'event.description',
        'event.id as id',
        'category.category',
        'event.created_at',
        'event.ended_at',
        'event.spots_available',
        'host.username as host',
        'event_threshold.auto_join_threshold',
        'event_threshold.auto_leave_threshold',
        'event_threshold.size',
        'event.is_mobile',
        ctx.raw(
          "JSON_BUILD_OBJECT('coordinates', ST_AsGeoJSON(coordinates)::json -> 'coordinates', 'accuracy', accuracy, 'timestamp', timestamp) AS position"
        ),
        ctx.raw(
          'COALESCE(CAST(participant_count.interested_count AS INTEGER), 0) AS interested_count'
        ),
        ctx.raw('COALESCE(CAST(present_count.attendance_count AS INTEGER), 0) AS attendance_count')
      );

    return q;
  }

  /**Returns the username and id of the user hosting an event. */
  async getHostByEventId(
    event_id: string,
    ctx: DBContext
  ): Promise<{ username: string; id: string }> {
    return await ctx(tablenames.event_instance)
      .where({ id: event_id })
      .select('author_id as id')
      .first();
  }

  /**Finds an event by id. */
  async findById(id: string, ctx: DBContext) {
    return await this.getBaseQuery(ctx).where({ 'event.id': id }).first();
  }

  /**Finds all events hosted by a user. */
  async findByHostId(host_id: string, ctx: DBContext) {
    return await this.getBaseQuery(ctx).where({ host_user_id: host_id });
  }

  /**Finds all events a user has attended. */
  async findAttendedByUserId(user_id: string, ctx: DBContext) {
    return await this.getBaseQuery(ctx)
      .whereIn(
        'attendance_status_id',
        ctx
          .select('id')
          .from(tablenames.event_attendance_status)
          .whereIn('label', ['joined', 'left', 'host'])
      )
      .andWhere({
        user_id,
      });
  }

  /**Returns all events within the specified distance to the provided coordinates. */
  async findWithinDistanceByCoordinates(
    longitude: number,
    latitude: number,
    distance: number,
    ctx: DBContext,
    search: string | null = null
  ) {
    const base = Repository.withSearch(this.getBaseQuery(ctx), search, ['title', 'description']);
    base
      .whereRaw(
        `ST_DWithin(
  position.coordinates,
  ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography,
  ?  -- distance in meters
)
`,
        [longitude, latitude, distance]
      )
      .where({ ended_at: null });

    return await base;
  }

  /**Returns the number of users who are interested in an event. Excludes the host. */
  async countInterestedById(event_id: string, ctx: DBContext) {
    const result = await ctx(tablenames.event_attendance)
      .where({ event_instance_id: event_id })
      .andWhereNot(
        'attendance_status_id',
        ctx.select('id').from(tablenames.event_attendance_status).where({ label: 'host' }).limit(1)
      )
      .count('* as count')
      .first();
    return typeof result.count === 'string' ? parseInt(result.count) : result.count;
  }

  /**Updates an event instance. */
  async updateById(
    event_id: string,
    payload: Omit<z.infer<typeof updateEventSchema>, 'id'>,
    ctx: DBContext
  ) {
    await ctx(tablenames.event_instance).where({ id: event_id }).update(payload);
    return await this.getBaseQuery(ctx).where({ id: event_id }).first();
  }

  async create(
    payload: z.infer<typeof createEventSchema> & { author_id: string },
    ctx: Knex.Transaction
  ) {
    const { position, ...data } = payload;
    const [newEventRecord] = await ctx(tablenames.event_instance).insert(
      {
        title: data.title,
        description: data.description,
        spots_available: data.spots_available,
        is_mobile: data.is_mobile,
        event_threshold_id: ctx
          .select('id')
          .from(tablenames.event_threshold)
          .where({ label: data.size })
          .limit(1),
        event_category_id: ctx
          .select('id')
          .from(tablenames.event_category)
          .where({ label: data.category })
          .limit(1),
        author_id: data.author_id,
      },
      ['id']
    );

    await ctx(tablenames.event_position).insert({
      event_id: newEventRecord.id,
      coordinates: createGeographyRow(position.coordinates),
      timestamp: position.timestamp,
      accuracy: position.accuracy,
    });

    return newEventRecord;
  }
}

export class TestEventRepository extends EventRepository {
  public getBaseQuery(ctx: DBContext) {
    return super.getBaseQuery(ctx);
  }
}
