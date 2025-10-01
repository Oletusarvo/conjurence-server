import db from '../../../../dbconfig';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { attendanceService } from '../../attendance/services/attendance-service';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';

export default async function getAttendanceForEventHandler(
  req: AuthenticatedUserRequest,
  res: ExpressResponse
) {
  try {
    const { eventId } = req.params;
    const attendants = await attendanceService.repo.findByEventInstanceId(eventId, db);

    return res.status(200).json(attendants);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).end();
  }
}
