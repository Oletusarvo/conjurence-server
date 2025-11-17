import db from '../../../../dbconfig';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { createHandler } from '../../../util/create-handler';
import { eventService } from '../services/event-service';

/**
 * Returns all events close to the users current location.
 */
export const getNearbyEventsHandler = createHandler(
  async (req: ExpressRequest, res: ExpressResponse) => {
    const { q, lng, lat } = req.query;
    const latitude = typeof lat === 'string' ? parseFloat(lat) : 0;
    const longitude = typeof lng === 'string' ? parseFloat(lng) : 0;
    const events = await eventService.repo.findWithinDistanceByCoordinates(
      longitude,
      latitude,
      20000,
      db,
      q as string
    );

    return res.status(200).json(events);
  }
);
