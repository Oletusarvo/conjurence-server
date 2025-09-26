import { ExpressResponse } from '../../../express-server-types';
import { AuthenticatedUserRequest } from '../types/authenticated-user';

export async function getSessionHandler(req: AuthenticatedUserRequest, res: ExpressResponse) {
  try {
    //Returns the session-object decoded by checkAuth.
    return res.status(200).json(req.session);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).end();
  }
}
