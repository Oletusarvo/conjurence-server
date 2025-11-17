import db from '../../../../dbconfig';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { createHandler } from '../../../util/create-handler';
import { tryCatch } from '../../../util/try-catch';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';
import { dispatcher } from '../../dispatcher/dispatcher';
import { eventService } from '../services/event-service';

export const endEventHandler = createHandler(
  async (req: AuthenticatedUserRequest, res: ExpressResponse) => {
    const session = req.session;
    const { eventId } = req.params;
    const { error } = await tryCatch(async () =>
      eventService.verifyAuthorship(eventId, session.user.id, db)
    );
    if (error) {
      return res.status(409).end();
    }
    await eventService.endEvent(eventId, db);
    global.io.to('event:' + eventId).emit('event:end', { eventId });
    return res.status(200).end();
  }
);
