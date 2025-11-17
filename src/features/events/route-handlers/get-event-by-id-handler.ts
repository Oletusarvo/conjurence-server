import db from '../../../../dbconfig';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { createHandler } from '../../../util/create-handler';
import { eventService } from '../services/event-service';

export const getEventByIdHandler = createHandler(
  async (req: ExpressRequest, res: ExpressResponse) => {
    const { eventId } = req.params;
    const event = await eventService.repo.findById(eventId as string, db);
    return res.status(200).json(event);
  }
);
