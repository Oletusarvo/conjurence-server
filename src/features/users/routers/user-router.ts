import { getRouter } from '../../../util/get-router';
import verifyRating from '../middleware/verify-rating';
import { checkAuth } from '../../auth/util/check-auth';
import createAttendanceOnEventHandler from '../route-handlers/create-attendance-on-event-handler';
import createUserRatingHandler from '../route-handlers/create-user-rating-handler';
import deleteUserHandler from '../route-handlers/delete-user-handler';
import { getActiveAttendanceHandler } from '../route-handlers/get-active-attendance-handler';
import getAttendanceOnEventHandler from '../route-handlers/get-attendance-on-event-handler';
import getEventTemplateByIdHandler from '../route-handlers/get-event-template-by-id-handler';
import getEventTemplatesHandler from '../route-handlers/get-event-templates-handler';
import { updateAttendanceOnEventHandler } from '../route-handlers/update-attendance-on-event-handler';
import updateUserRatingHandler from '../route-handlers/update-user-rating-handler';

const router = getRouter();

router.post('/:userId/rating', checkAuth, verifyRating, createUserRatingHandler);
router.put('/:userId/rating', checkAuth, verifyRating, updateUserRatingHandler);
router.get('/:userId/event-templates', checkAuth, getEventTemplatesHandler);
router.get('/:userId/event-templates/:templateId', checkAuth, getEventTemplateByIdHandler);
router.get('/:userId/attendance/active', checkAuth, getActiveAttendanceHandler);
router.get('/:userId/attendance/:eventId', checkAuth, getAttendanceOnEventHandler);

router.put('/:userId/attendance/:eventId', checkAuth, updateAttendanceOnEventHandler);
router.post('/:userId/attendance/:eventId', checkAuth, createAttendanceOnEventHandler);
router.delete('/:userId', checkAuth, deleteUserHandler);

export { router as userRouter };
