import db from '../../../../dbconfig';
import { ExpressResponse } from '../../../express-server-types';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';
import { eventTemplateService } from '../../events/services/event-template-service';

export default async function getTemplateHandler(
  req: AuthenticatedUserRequest,
  res: ExpressResponse
) {
  try {
    const template = await eventTemplateService.repo.findTemplateById(req.params.templateId, db);
    return res.status(200).json(template);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).end();
  }
}
