import { ExpressResponse } from '../../../express-server-types';
import { createHandler } from '../../../util/create-handler';
import { tryCatch } from '../../../util/try-catch';
import { authConfig } from '../auth.config';
import { AuthenticatedUserRequest } from '../types/authenticated-user';
import { verifyJWT } from '../util/verify-jwt';

export const getSessionHandler = createHandler(
  async (req: AuthenticatedUserRequest, res: ExpressResponse) => {
    const session = req.session;
    //Returns the session-object decoded by checkAuth.
    return res.status(200).json(session);
  }
);
