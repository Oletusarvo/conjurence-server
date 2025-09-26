import { tryCatch } from '../../../util/try-catch';
import { TUser } from '../types/user';
import { verifyJWT } from './verify-jwt';

export default async function decodeToken(token: string) {
  const { value: decodedToken, error } = await tryCatch(
    () =>
      verifyJWT(token) as unknown as {
        user: TUser;
        exp: string;
      }
  );

  if (!decodedToken) {
    throw new Error('No payload present after token decode!');
  }

  return { decodedToken, error };
}
