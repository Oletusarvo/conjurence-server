import jwt from 'jsonwebtoken';

export function verifyJWT(token: string) {
  return jwt.verify(token, process.env.TOKEN_SECRET as string);
}
