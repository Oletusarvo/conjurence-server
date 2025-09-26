import db from '../../../../dbconfig';
import { ExpressResponse } from '../../../express-server-types';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';
import { eventTemplateService } from '../../events/services/event-template-service';

export default async function getEventTemplatesHandler(
  req: AuthenticatedUserRequest,
  res: ExpressResponse
) {
  try {
    const templates = await eventTemplateService.repo.findTemplatesByAuthorId(
      req.session.user.id,
      req.query.q as string,
      db
    );
    return res.status(200).json(templates);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).end();
  }
}
