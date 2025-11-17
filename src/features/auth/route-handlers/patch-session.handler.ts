import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { createHandler } from '../../../util/create-handler';
import { authConfig } from '../auth.config';
import { AuthenticatedUserRequest } from '../types/authenticated-user';
import { createJWT } from '../util/create-jwt';

export const patchSessionHandler = createHandler(
  async (req: AuthenticatedUserRequest, res: ExpressResponse) => {
    const sessionUpdate = req.body;
    const newSession = {
      ...req.session,
      ...sessionUpdate,
    };
    const token = createJWT(newSession, {
      expiresIn: '1h',
    });

    return res
      .status(200)

      .json({
        token,
        session: newSession,
      });
  }
);
