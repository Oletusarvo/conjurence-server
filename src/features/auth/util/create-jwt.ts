import jwt from 'jsonwebtoken';

export function createJWT(payload: Record<string, unknown>, options?: jwt.SignOptions) {
  return jwt.sign(payload, process.env.TOKEN_SECRET as string, options);
}
