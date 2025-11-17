import db from '../../../../dbconfig';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { tablenames } from '../../../tablenames';
import { createHandler } from '../../../util/create-handler';
import { hashPassword } from '../util/hash-password';
import { verifyJWT } from '../util/verify-jwt';

export const resetPasswordHandler = createHandler(
  async (req: ExpressRequest, res: ExpressResponse) => {
    const { token, newPassword } = req.body;
    const payload = verifyJWT(token) as { user_id: string };

    await db(tablenames.user)
      .where({
        id: payload.user_id,
      })
      .update({
        password: await hashPassword(newPassword),
      });
    return res.status(200).end();
  }
);
