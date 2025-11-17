import db from '../../../../dbconfig';
import { ExpressResponse } from '../../../express-server-types';
import { createHandler } from '../../../util/create-handler';
import { attendanceService } from '../../attendance/services/attendance-service';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';

export const getActiveAttendanceHandler = createHandler(
  async (req: AuthenticatedUserRequest, res: ExpressResponse) => {
    const { userId } = req.params;
    const session = req.session;
    if (userId !== session.user.id) {
      return res.status(403).end();
    }

    const attendance = await attendanceService.repo.findRecentActiveByUserId(session.user.id, db);
    return res.status(200).json(attendance);
  }
);
