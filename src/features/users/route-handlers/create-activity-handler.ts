import z from 'zod';
import { ExpressResponse } from '../../../express-server-types';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';
import db from '../../../../dbconfig';
import { tablenames } from '../../../tablenames';
import { activitySchema } from '../../events/schemas/activity-schema';
import { createHandler } from '../../../util/create-handler';

export const createActivityHandler = createHandler(
  async (req: AuthenticatedUserRequest, res: ExpressResponse) => {
    const parseResult = activitySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(z.treeifyError(parseResult.error));
    }

    const session = req.session;
    const data = parseResult.data;

    await db(tablenames.activity).insert({
      title: data.title,
      description: data.description,
      author_id: session.user.id,
      event_category_id: db
        .select('id')
        .from(tablenames.event_category)
        .where({ label: data.category })
        .limit(1),
    });

    return res.status(200).end();
  }
);
