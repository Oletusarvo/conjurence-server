import db from '../../../../dbconfig';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { createHandler } from '../../../util/create-handler';
import { attendanceService } from '../../attendance/services/attendance-service';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';

export const getAttendanceOnEventHandler = createHandler(
  async (req: AuthenticatedUserRequest, res: ExpressResponse) => {
    const { eventId } = req.params;
    const attendants = await attendanceService.repo.findByEventInstanceId(eventId, db);

    return res.status(200).json(attendants);
  }
);
