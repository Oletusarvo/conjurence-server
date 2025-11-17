import db from '../../../../dbconfig';
import { ExpressResponse } from '../../../express-server-types';
import { createHandler } from '../../../util/create-handler';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';
import { eventTemplateService } from '../../events/services/event-template-service';

export const getUserActivitiesHandler = createHandler(
  async (req: AuthenticatedUserRequest, res: ExpressResponse) => {
    const templates = await eventTemplateService.repo.findTemplatesByAuthorId(
      req.session.user.id,
      req.query.q as string,
      db
    );
    return res.status(200).json(templates);
  }
);
