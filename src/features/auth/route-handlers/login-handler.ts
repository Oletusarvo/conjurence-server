import z from 'zod';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { createJWT } from '../util/create-jwt';
import db from '../../../../dbconfig';
import { authRepository } from '../repos/auth-repository';
import { tryCatch } from '../../../util/try-catch';
import { authService } from '../services/auth-service';
import { loginCredentialsSchema } from '../schemas/login-credentials-schema';
import { tablenames } from '../../../tablenames';
import { attendanceService } from '../../attendance/services/attendance-service';
import { TUser } from '../types/user';
import { authConfig } from '../auth.config';

export async function getHandler(req: ExpressRequest, res: ExpressResponse) {
  try {
    const token = createJWT(
      { user_id: 'test' },
      {
        expiresIn: '60min',
      }
    );

    return res.status(200).send(token);
  } catch (err: any) {
    return res.status(500).send('An unexpected error occured!');
  }
}

export async function postHandler(req: ExpressRequest, res: ExpressResponse) {
  try {
    const credentials = req.body;
    if (!credentials) return res.status(400).send('Credentials missing from request!');

    const parseResult = loginCredentialsSchema.safeParse(credentials);
    if (!parseResult.success) {
      return res.status(400).json(z.flattenError(parseResult.error));
    }
    const { email, password } = parseResult.data;

    const user = await authService.repo.findUserByEmail(email, db);
    if (!user) {
      return res.status(401).end();
    }
    const passwordOk = await authService.verifyPasswordByEmail(email, password, db);

    if (!passwordOk) {
      return res.status(401).send();
    }

    const pr = await attendanceService.repo.findRecentActiveByUserId(user.id, db);
    const subscriptionRecord = await db(tablenames.user_subscription)
      .where({
        id: db.select('user_subscription_id').from(tablenames.user).where({ id: user.id }).limit(1),
      })
      .select('allow_templates', 'allow_mobile_events', 'maximum_event_size_id')
      .first();

    const session = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        status: user.status,
        attended_event_id: pr?.event_instance_id || null,
        subscription: subscriptionRecord,
        avg_rating: user.avg_rating,
      } satisfies TUser,
    };

    console.log(session);
    const token = createJWT(session, {
      expiresIn: '1h',
    });

    return res.status(200).json({ token });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).end();
  }
}
