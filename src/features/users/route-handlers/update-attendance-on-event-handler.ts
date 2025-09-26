import db from '../../../../dbconfig';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { tablenames } from '../../../tablenames';
import { attendanceService } from '../../attendance/services/attendance-service';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';
import { dispatcher } from '../../dispatcher/dispatcher';

export async function updateAttendanceOnEventHandler(
  req: AuthenticatedUserRequest,
  res: ExpressResponse
) {
  try {
    const session = req.session;
    const { eventId } = req.params;

    const updatedAttendanceRecord = await attendanceService.repo.updateBy(
      {
        query: { event_instance_id: eventId, user_id: session.user.id },
        payload: {
          attendance_status_id: db
            .select('id')
            .from(tablenames.event_attendance_status)
            .where({ label: req.body.status })
            .limit(1),
          updated_at: new Date(),
        },
      },
      db
    );

    dispatcher.dispatch({
      to: `event:${eventId}`,
      message: 'event:attendance_update',
      payload: {
        username: updatedAttendanceRecord.username,
        eventId,
        updatedAttendanceRecord,
      },
    });

    return res.status(200).json(updatedAttendanceRecord);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).end();
  }
}
