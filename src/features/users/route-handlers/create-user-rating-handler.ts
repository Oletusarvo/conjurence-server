import db from '../../../../dbconfig';
import { ExpressResponse } from '../../../express-server-types';
import { tablenames } from '../../../tablenames';
import { createHandler } from '../../../util/create-handler';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';

export const createUserRatingHandler = createHandler(
  async (req: AuthenticatedUserRequest, res: ExpressResponse) => {
    const session = req.session;
    const { userId } = req.params;
    const { rating } = req.body;

    await db(tablenames.user_interaction)
      .insert({
        from_user_id: session.user.id,
        to_user_id: userId,
        metadata: {
          rating,
        },
      })
      .onConflict(['user_id', 'to_user_id', 'interaction_type_id'])
      .merge();
    return res.status(200).end();
  }
);
