import { ExpressResponse } from '../../../express-server-types';
import { tryCatch } from '../../../util/try-catch';
import { authConfig } from '../auth.config';
import { AuthenticatedUserRequest } from '../types/authenticated-user';
import { verifyJWT } from '../util/verify-jwt';

export async function getSessionHandler(req: AuthenticatedUserRequest, res: ExpressResponse) {
  try {
    const session = req.session;
    //Returns the session-object decoded by checkAuth.
    return res.status(200).json(session);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).end();
  }
}
