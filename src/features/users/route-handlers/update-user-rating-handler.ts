import db from '../../../../dbconfig';
import { ExpressResponse } from '../../../express-server-types';
import { tablenames } from '../../../tablenames';
import { attendanceService } from '../../attendance/services/attendance-service';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';

export default async function updateUserRatingHandler(
  req: AuthenticatedUserRequest,
  res: ExpressResponse
) {
  try {
    const session = req.session;
    const { userId } = req.params;

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

    const { rating } = req.body;
    await db(tablenames.user_rating)
      .where({ user_id: userId, rater_user_id: session.user.id })
      .update({ rating });

    return res.status(200).end();
  } catch (err) {
    console.log(err.message);
    return res.status(500).end();
  }
}
