import db from '../../../../dbconfig';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { eventService } from '../services/event-service';

export default async function getNearbyHandler(req: ExpressRequest, res: ExpressResponse) {
  try {
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
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).end();
  }
}
