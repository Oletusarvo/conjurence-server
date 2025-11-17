import db from '../../../../dbconfig';
import { ExpressResponse } from '../../../express-server-types';
import { createHandler } from '../../../util/create-handler';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';
import { eventTemplateService } from '../services/event-template-service';

/** Returns an activity by its id.*/
export const getActivityByIdHandler = createHandler(
  async (req: AuthenticatedUserRequest, res: ExpressResponse) => {
    const template = await eventTemplateService.repo.findTemplateById(req.params.templateId, db);
    return res.status(200).json(template);
  }
);
