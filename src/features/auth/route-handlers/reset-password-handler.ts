import db from '../../../../dbconfig';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { tablenames } from '../../../tablenames';
import { hashPassword } from '../util/hash-password';
import { verifyJWT } from '../util/verify-jwt';

export default async function resetPasswordHandler(req: ExpressRequest, res: ExpressResponse) {
  try {
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
  } catch (err) {
    console.log(err.message);
    return res.status(500).end();
  }
}
