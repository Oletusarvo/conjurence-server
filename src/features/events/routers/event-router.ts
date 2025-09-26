import { getRouter } from '../../../util/get-router';
import { checkAuth } from '../../auth/util/check-auth';
import endEventHandler from '../route-handlers/end-event-handler';
import getAttendanceForEventHandler from '../route-handlers/get-attendance-for-event-handler';
import getHandler from '../route-handlers/get-handler';
import getNearbyHandler from '../route-handlers/get-nearby-handler';
import postHandler from '../route-handlers/post-handler';

const router = getRouter();
router.get('/get-nearby', checkAuth, getNearbyHandler);
router.put('/:eventId/end', checkAuth, endEventHandler);
router.get('/:eventId/attendance', checkAuth, getAttendanceForEventHandler);
router.get('/:eventId', checkAuth, getHandler);
router.post('/', checkAuth, postHandler);

export { router as eventRouter };
