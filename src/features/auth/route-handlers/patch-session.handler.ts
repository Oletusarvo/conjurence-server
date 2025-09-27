import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { authConfig } from '../auth.config';
import { AuthenticatedUserRequest } from '../types/authenticated-user';
import { createJWT } from '../util/create-jwt';

export async function patchSessionHandler(req: AuthenticatedUserRequest, res: ExpressResponse) {
  try {
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
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).end();
  }
}
