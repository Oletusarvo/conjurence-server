import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  const hashRounds = process.env.PASSWORD_HASH_ROUNDS;
  return await bcrypt.hash(password, hashRounds ? parseInt(hashRounds) : 15);
}
