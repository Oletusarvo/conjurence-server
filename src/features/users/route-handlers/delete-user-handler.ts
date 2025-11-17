import db from '../../../../dbconfig';
import { ExpressResponse } from '../../../express-server-types';
import { tablenames } from '../../../tablenames';
import { createHandler } from '../../../util/create-handler';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';

export const deleteUserHandler = createHandler(
  async (req: AuthenticatedUserRequest, res: ExpressResponse) => {
    const session = req.session;
    const { userId } = req.params;
    if (session.user.id !== userId) {
      return res.status(403).end();
    }
    await db(tablenames.user).where({ id: userId }).del();
    return res.status(200).end();
  }
);
