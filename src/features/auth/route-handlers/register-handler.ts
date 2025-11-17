import z from 'zod';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { authRepository } from '../repos/auth-repository';
import { registerCredentialsSchema } from '../schemas/register-credentials-schema';
import db from '../../../../dbconfig';
import { verifyJWT } from '../util/verify-jwt';
import { tryCatch } from '../../../util/try-catch';
import { createHandler } from '../../../util/create-handler';

export const registerHandler = createHandler(async (req: ExpressRequest, res: ExpressResponse) => {
  const parseResult = registerCredentialsSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).send(z.treeifyError(parseResult.error));
  }

  const { token, ...credentials } = parseResult.data;
  const { value: decoded, error } = await tryCatch(() => verifyJWT(token) as { email: string });

  if (error) {
    return res.status(401).send('Invalid token!');
  }

  await authRepository.createUser(
    {
      email: decoded.email,
      username: credentials.username,
      password: credentials.password1,
      subscription: credentials.subscription,
    },
    db
  );
  return res.status(200).end();
});
