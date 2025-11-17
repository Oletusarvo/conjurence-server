import db from '../../../../dbconfig';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { tablenames } from '../../../tablenames';
import { createHandler } from '../../../util/create-handler';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';

export const blockUserHandler = createHandler(
  async (req: AuthenticatedUserRequest, res: ExpressResponse) => {
    const { userId } = req.params;
    const session = req.session;

    await db(tablenames.user_interaction).insert({
      to_user_id: userId,
      from_user_id: session.user.id,
      interaction_type_id: db
        .select('id')
        .from(tablenames.user_interaction_type)
        .where({ label: 'block' })
        .limit(1),
    });

    return res.status(200).end();
  }
);
