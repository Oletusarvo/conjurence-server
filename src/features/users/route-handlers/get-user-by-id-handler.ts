import db from '../../../../dbconfig';
import { ExpressResponse } from '../../../express-server-types';
import { tablenames } from '../../../tablenames';
import { createHandler } from '../../../util/create-handler';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';

export const getUserByIdHandler = createHandler(
  async (req: AuthenticatedUserRequest, res: ExpressResponse) => {
    const { userId } = req.params;

    const user = await db({ user: tablenames.user })
      .leftJoin(
        db
          .select('metadata', 'to_user_id', 'interaction_type_id')

          .from(tablenames.user_interaction)
          .where({
            interaction_type_id: db
              .select('id')
              .from(tablenames.user_interaction_type)
              .where({ label: 'rating' })
              .limit(1),
          })
          .as('user_interaction'),
        'user_interaction.to_user_id',
        'user.id'
      )
      .where({
        'user.id': userId,
      })

      .select(
        db.raw(
          "(SUM(CASE WHEN metadata IS NOT NULL THEN (metadata->>'rating')::numeric ELSE NULL END) / COALESCE(COUNT(*), 1)) as avg_rating"
        ),
        'user.id',
        'user.username'
      )
      .groupBy('user.id')
      .first();

    return res.status(200).json(user);
  }
);
