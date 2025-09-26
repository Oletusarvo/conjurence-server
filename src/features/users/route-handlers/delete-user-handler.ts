import db from '../../../../dbconfig';
import { ExpressResponse } from '../../../express-server-types';
import { tablenames } from '../../../tablenames';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';

export default async function deleteUserHandler(
  req: AuthenticatedUserRequest,
  res: ExpressResponse
) {
  try {
    const session = req.session;
    const { userId } = req.params;
    if (session.user.id !== userId) {
      return res.status(403).end();
    }
    await db(tablenames.user).where({ id: userId }).del();
    return res.status(200).end();
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).end();
  }
}
