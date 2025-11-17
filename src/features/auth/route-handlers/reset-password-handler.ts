import z from 'zod';
import db from '../../../../dbconfig';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { tablenames } from '../../../tablenames';
import { createHandler } from '../../../util/create-handler';
import { resetPasswordSchema } from '../schemas/reset-password-schema';
import { hashPassword } from '../util/hash-password';
import { verifyJWT } from '../util/verify-jwt';

export const resetPasswordHandler = createHandler(
  async (req: ExpressRequest, res: ExpressResponse) => {
    const parseResult = resetPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(z.treeifyError(parseResult.error));
    }

    const { token, password1: password } = parseResult.data;
    const payload = verifyJWT(token) as { user_id: string };

    await db(tablenames.user)
      .where({
        id: payload.user_id,
      })
      .update({
        password: await hashPassword(password),
      });
    return res.status(200).end();
  }
);
