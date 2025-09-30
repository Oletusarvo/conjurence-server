import z from 'zod';
import { registerCredentialsSchema } from '../schemas/register-credentials-schema';
import { DBContext } from '../../../db-context';

import { hashPassword } from '../util/hash-password';
import { Repository } from '../../../util/repository';
import { tablenames } from '../../../tablenames';

export class AuthRepository extends Repository {
  async getSubscription(user_id: string, ctx: DBContext) {
    return await ctx(tablenames.user_subscription)
      .where({
        id: ctx
          .select('user_subscription_id')
          .from(tablenames.user)
          .where({ id: user_id })
          .limit(1),
      })
      .first();
  }

  async findUserByEmail(email: string, ctx: DBContext) {
    return await ctx({ user: tablenames.user })
      .with('user_rating_sum', ctx.sum('rating as total').from(tablenames.user_rating))
      .where({ email })
      .join(
        ctx
          .select('id', 'label')
          .from(tablenames.user_status)
          .groupBy('id', 'label')
          .as('user_status'),
        'user_status.id',
        'user.user_status_id'
      )
      .leftJoin(
        ctx
          .select('user_id')
          .count('* as count')
          .from(tablenames.user_rating)
          .groupBy('user_id')
          .as('user_rating_qty'),
        'user_rating_qty.user_id',
        'user.id'
      )

      .select(
        'user.id',
        'email',
        'username',
        'user_status.label as status',
        ctx.raw(
          'CAST((SELECT total FROM user_rating_sum LIMIT 1) / COALESCE(user_rating_qty.count, 1) AS INTEGER) as avg_rating'
        )
      )
      .first();
  }

  /**Creates a new user record. */
  async createUser(
    {
      username,
      email,
      password,
      subscription,
    }: {
      username: string;
      email: string;
      password: string;
      subscription: z.infer<typeof registerCredentialsSchema.shape.subscription>;
    },
    ctx: DBContext
  ) {
    const [newUserRecord] = await ctx(tablenames.user).insert(
      {
        user_status_id: ctx(tablenames.user_status)
          .where({ label: 'pending' })
          .select('id')
          .limit(1),
        username,
        email,
        password: await hashPassword(password),
        terms_accepted_on: new Date(),
        user_subscription_id: ctx
          .select('id')
          .from(tablenames.user_subscription)
          .where({ label: subscription })
          .limit(1),
      },
      ['id']
    );
    return newUserRecord;
  }

  async getEncryptedPasswordByEmail(email: string, ctx: DBContext) {
    const [encrypted] = await ctx(tablenames.user).where({ email }).pluck('password');
    return encrypted;
  }

  async deleteById(id: string, ctx: DBContext) {
    await ctx(tablenames.user).where({ id }).delete();
  }
}

export const authRepository = new AuthRepository();
