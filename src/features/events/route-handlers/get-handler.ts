import db from '../../../../dbconfig';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { eventService } from '../services/event-service';

export default async function getHandler(req: ExpressRequest, res: ExpressResponse) {
  try {
    const { eventId } = req.params;
    const event = await eventService.repo.findById(eventId as string, db);

    return res.status(200).json(event);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).end();
  }
}
