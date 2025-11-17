import db from '../../../../dbconfig';
import { ExpressResponse } from '../../../express-server-types';
import { tablenames } from '../../../tablenames';
import { createHandler } from '../../../util/create-handler';
import { attendanceService } from '../../attendance/services/attendance-service';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';

export const updateUserRatingHandler = createHandler(
  async (req: AuthenticatedUserRequest, res: ExpressResponse) => {
    const session = req.session;
    const { userId } = req.params;

    const { rating } = req.body;
    await db(tablenames.user_interaction)
      .where({
        to_user_id: userId,
        from_user_id: session.user.id,
        interaction_type_id: db
          .select('id')
          .from(tablenames.user_interaction_type)
          .where({ label: 'rating' })
          .limit(1),
      })
      .update({
        metadata: {
          rating,
        },
      });

    return res.status(200).end();
  }
);
