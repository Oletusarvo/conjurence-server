import z from 'zod';
import { ExpressResponse } from '../../../express-server-types';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';
import db from '../../../../dbconfig';
import { tablenames } from '../../../tablenames';
import { activitySchema } from '../../events/schemas/activity-schema';
import { eventTemplateService } from '../../events/services/event-template-service';
import { createHandler } from '../../../util/create-handler';

export const createActivityHandler = createHandler(
  async (req: AuthenticatedUserRequest, res: ExpressResponse) => {
    const parseResult = activitySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(z.treeifyError(parseResult.error));
    }

    const session = req.session;
    const data = parseResult.data;
    await eventTemplateService.repo.create(
      {
        ...data,
        author_id: session.user.id,
      },
      db
    );

    return res.status(200).end();
  }
);
