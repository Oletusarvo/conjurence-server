import { NextFunction } from 'express';
import db from '../../../../dbconfig';
import { ExpressResponse } from '../../../express-server-types';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';
import { attendanceService } from '../../attendance/services/attendance-service';

export default async function verifyRating(
  req: AuthenticatedUserRequest,
  res: ExpressResponse,
  next: NextFunction
) {
  try {
    const session = req.session;
    const { userId } = req.params;
    console.log(req.body.rating);
    const ratingUserAttendance = await attendanceService.repo.findRecentActiveByUserId(
      session.user.id,
      db
    );
    //Prevent rating if both users are not attending the same event.
    const ratedUserAttendance = await attendanceService.repo.findRecentActiveByUserId(userId, db);
    if (
      !ratedUserAttendance ||
      !ratingUserAttendance ||
      ratingUserAttendance.event_instance_id !== ratedUserAttendance.event_instance_id ||
      //Disallow a user rating themselves
      userId === session.user.id
    ) {
      return res.status(409).end();
    }
    return next();
  } catch (err) {
    console.log(err.message);
    return res.status(500).end();
  }
}
