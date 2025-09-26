import axios from 'axios';
import db from '../../../../dbconfig';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';

import { eventService } from '../../events/services/event-service';
import { dispatcher } from '../../dispatcher/dispatcher';
import { attendanceService } from '../../attendance/services/attendance-service';

export default async function createAttendanceOnEventHandler(
  req: AuthenticatedUserRequest,
  res: ExpressResponse
) {
  try {
    const session = req.session;
    const payload = req.body;
    const currentAttendanceRecord = await attendanceService.repo
      .findBy({ user_id: session.user.id, event_instance_id: payload.event_id }, db)
      .first();

    if (currentAttendanceRecord) {
      return res.status(303).json(currentAttendanceRecord);
    }

    const newAttendanceRecord = await attendanceService.repo.create(
      {
        user_id: session.user.id,
        event_instance_id: payload.event_id,
        status: payload.status,
      },
      db
    );

    const interestCount = await eventService.repo.countInterestedById(payload.event_id, db);

    console.log(newAttendanceRecord);
    dispatcher.dispatch({
      to: `event:${payload.event_id}`,
      message: 'event:interest',
      payload: {
        username: session.user.username,
        eventId: payload.event_id,
        currentInterestCount: interestCount,
        newAttendanceRecord,
      },
    });

    return res.status(200).json(newAttendanceRecord);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).end();
  }
}
