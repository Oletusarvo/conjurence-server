import { getRouter } from '../../../util/get-router';
import { checkAuth } from '../../auth/middleware/check-auth';
import { createEventHandler } from '../route-handlers/create-event-handler';
import { deleteEventHandler } from '../route-handlers/delete-event-handler';
import { endEventHandler } from '../route-handlers/end-event-handler';
import { getAttendanceForEventHandler } from '../route-handlers/get-attendance-for-event-handler';
import { getEventByIdHandler } from '../route-handlers/get-event-by-id-handler';
import { getNearbyEventsHandler } from '../route-handlers/get-nearby-events-handler';

import { rateEventHandler } from '../route-handlers/rate-event-handler';

const router = getRouter();
router.get('/get-nearby', checkAuth, getNearbyEventsHandler);
router.put('/:eventId/end', checkAuth, endEventHandler);
router.get('/:eventId/attendance', checkAuth, getAttendanceForEventHandler);
router.get('/:eventId', checkAuth, getEventByIdHandler);
router.delete('/:eventId', checkAuth, deleteEventHandler);
router.post('/', checkAuth, createEventHandler);
router.post('/:eventId/rating', checkAuth, rateEventHandler);

export { router as eventRouter };
