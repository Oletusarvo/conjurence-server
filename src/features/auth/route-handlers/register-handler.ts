import z from 'zod';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { authRepository } from '../repos/auth-repository';
import { registerCredentialsSchema } from '../schemas/register-credentials-schema';
import db from '../../../../dbconfig';
import { verifyJWT } from '../util/verify-jwt';
import { tryCatch } from '../../../util/try-catch';

export async function registerHandler(req: ExpressRequest, res: ExpressResponse) {
  try {
    const { token, ...credentials } = req.body;
    const { value, error } = await tryCatch(() => verifyJWT(token) as { email: string });

    if (error) {
      return res.status(401).end();
    }

    if (!credentials) {
      return res.status(400).send('Credentials missing from request!');
    }

    credentials.email = value.email;
    const parseResult = registerCredentialsSchema.safeParse(credentials);
    if (!parseResult.success) {
      return res.status(400).send(z.treeifyError(parseResult.error));
    }

    await authRepository.createUser(
      {
        email: parseResult.data.email,
        username: parseResult.data.username,
        password: parseResult.data.password1,
        subscription: parseResult.data.subscription,
      },
      db
    );
    return res.status(200).end();
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).send('An unexpected error occured!');
  }
}
