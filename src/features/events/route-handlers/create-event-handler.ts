import z from 'zod';
import db from '../../../../dbconfig';
import { ExpressResponse } from '../../../express-server-types';
import { tablenames } from '../../../tablenames';
import { attendanceService } from '../../attendance/services/attendance-service';
import { authService } from '../../auth/services/auth-service';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';
import { createEventSchema } from '../schemas/event-schema';
import { eventService } from '../services/event-service';
import { eventTemplateService } from '../services/event-template-service';
import { createHandler } from '../../../util/create-handler';

export const createEventHandler = createHandler(
  async (req: AuthenticatedUserRequest, res: ExpressResponse) => {
    const session = req.session;
    const parseResult = createEventSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).send(z.treeifyError(parseResult.error));
    }

    const subscriptionRecord = await authService.repo.getSubscription(session.user.id, db);
    if (!subscriptionRecord) {
      return res.status(500).send('Failed to load subscription!');
    }

    const parsedData = parseResult.data;

    //Prevent mobile events if the subscription disallows it.
    if (parsedData.is_mobile && !subscriptionRecord.allow_mobile_events) {
      return res.status(409).send('event:mobile_not_allowed');
    }

    //Prevent adding events of bigger size than allowed by the subscription.
    if (subscriptionRecord) {
      const eventSizeRecord = await db(tablenames.event_threshold)
        .where({ label: parsedData.size })
        .select('id')
        .first();
      if (eventSizeRecord.id < subscriptionRecord.maximum_allowed_event_size) {
        return res.status(409).send('event:size_not_allowed');
      }
    }

    //Prevent creation of events if already hosting or joined to another.
    if (await isAttending(session)) {
      return res.status(409).send('event:single_attendance');
    }

    let attendance = null;
    await db.transaction(async trx => {
      const eventInstanceRecord = await eventService.repo.create(
        {
          ...parsedData,
          author_id: session.user.id,
        },
        trx
      );

      attendance = await attendanceService.repo.create(
        {
          user_id: session.user.id,
          event_instance_id: eventInstanceRecord.id,
          status: 'host',
        },
        trx
      );
    });

    return res.status(200).json(attendance);
  }
);

async function isAttending(session: any) {
  const currentAttendanceRecord = await db(tablenames.event_attendance)
    .whereIn(
      'attendance_status_id',
      db
        .select('id')
        .from(tablenames.event_attendance_status)
        .whereIn('label', ['host', 'joined', 'interested'])
    )
    .andWhere({ user_id: session.user.id })
    .select('user_id', 'event_instance_id')
    .orderBy('requested_at', 'desc')
    .first();

  if (currentAttendanceRecord) {
    const oldEventRecord = await db(tablenames.event_instance)
      .where({ id: currentAttendanceRecord.event_instance_id })
      .select('ended_at')
      .first();

    if (oldEventRecord.ended_at === null) {
      return true;
    }
  }
  return false;
}
