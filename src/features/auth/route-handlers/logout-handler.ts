import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { createHandler } from '../../../util/create-handler';
import { authConfig } from '../auth.config';

export const logoutHandler = createHandler(async (req: ExpressRequest, res: ExpressResponse) => {
  res.clearCookie(authConfig.accessTokenName);
  return res.status(200).end();
});
