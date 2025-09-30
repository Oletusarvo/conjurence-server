import db from '../../../../dbconfig';
import { ExpressResponse } from '../../../express-server-types';
import { tablenames } from '../../../tablenames';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';

export default async function createUserRatingHandler(
  req: AuthenticatedUserRequest,
  res: ExpressResponse
) {
  try {
    const session = req.session;
    const { userId } = req.params;
    const { rating } = req.body;
    await db(tablenames.user_rating)
      .insert({ rating, user_id: userId, rater_user_id: session.user.id })
      .onConflict(['user_id', 'rater_user_id'])
      .merge();
    return res.status(200).end();
  } catch (err) {
    console.log(err.message);
    return res.status(500).end();
  }
}
