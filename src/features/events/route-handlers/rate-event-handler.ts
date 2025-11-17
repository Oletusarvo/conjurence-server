import z from 'zod';
import db from '../../../../dbconfig';
import { ExpressResponse } from '../../../express-server-types';
import { tablenames } from '../../../tablenames';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';
import { eventRatingSchema } from '../schemas/event-rating-schema';
import { createHandler } from '../../../util/create-handler';

export const rateEventHandler = createHandler(
  async (req: AuthenticatedUserRequest, res: ExpressResponse) => {
    const { eventId } = req.params;
    const session = req.session;
    const parseResult = eventRatingSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(z.treeifyError(parseResult.error));
    }

    const data = parseResult.data;

    await db(tablenames.event_interaction).insert({
      from_user_id: session.user.id,
      to_event_id: eventId,
      interaction_type_id: db
        .select('id')
        .from(tablenames.event_interaction_type)
        .where({ label: data.type })
        .limit(1),
    });
    return res.status(200).end();
  }
);
