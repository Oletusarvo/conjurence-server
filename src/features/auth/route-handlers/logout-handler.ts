import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { authConfig } from '../auth.config';

export async function logoutHandler(req: ExpressRequest, res: ExpressResponse) {
  try {
    res.clearCookie(authConfig.accessTokenName);
    return res.status(200).end();
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).end();
  }
}
