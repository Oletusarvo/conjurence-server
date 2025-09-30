import { NextFunction, Request, Response } from 'express';
import { verifyJWT } from './verify-jwt';
import { AuthenticatedUserRequest } from '../types/authenticated-user';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { tryCatch } from '../../../util/try-catch';
import { authConfig } from '../auth.config';
import { TUser } from '../types/user';

export async function checkAuth(
  req: AuthenticatedUserRequest,
  res: ExpressResponse,
  next: NextFunction
) {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(401).send('auth:unauthorized');
    }

    const token = auth.split(' ')[1]; //Bearer <token>
    if (!token) {
      return res.status(401).send('auth:unauthorized');
    }

    const { value: decodedToken, error } = await tryCatch(
      () =>
        verifyJWT(token) as unknown as {
          user: TUser;
          exp: string;
        }
    );

    if (error) {
      return res.status(401).send('jwt:invalid');
    }

    if (!decodedToken) {
      throw new Error('No payload present after token decode!');
    }

    req.session = {
      user: {
        status: decodedToken.user.status,
        id: decodedToken.user.id,
        email: decodedToken.user.email,
        username: decodedToken.user.username,
        subscription: decodedToken.user.subscription,
        attended_event_id: decodedToken.user.attended_event_id,
        avg_rating: decodedToken.user.avg_rating,
      },
      expires: parseInt(decodedToken.exp),
    };

    return next();
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).send('An unexpected error occured!');
  }
}
