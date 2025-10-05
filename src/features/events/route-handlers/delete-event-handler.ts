import db from '../../../../dbconfig';
import { ExpressResponse } from '../../../express-server-types';
import { tryCatch } from '../../../util/try-catch';
import { AuthenticatedUserRequest } from '../../auth/types/authenticated-user';
import { dispatcher } from '../../dispatcher/dispatcher';
import { eventService } from '../services/event-service';

export default async function deleteEventHandler(
  req: AuthenticatedUserRequest,
  res: ExpressResponse
) {
  try {
    const session = req.session;
    const { eventId } = req.params;
    const { error } = await tryCatch(async () =>
      eventService.verifyAuthorship(eventId, session.user.id, db)
    );
    if (error) {
      return res.status(409).end();
    }
    await eventService.repo.deleteById(eventId, db);

    dispatcher.dispatch({
      message: 'event:end',
      to: `event:${eventId}`,
      payload: { eventId },
    });

    return res.status(200).end();
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).end();
  }
}
