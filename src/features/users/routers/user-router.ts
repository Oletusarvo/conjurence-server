import { getRouter } from '../../../util/get-router';
import verifyRating from '../middleware/verify-rating';
import { checkAuth } from '../../auth/util/check-auth';

import { getActiveAttendanceHandler } from '../route-handlers/get-active-attendance-handler';

import { updateAttendanceOnEventHandler } from '../route-handlers/update-attendance-on-event-handler';

import { blockUserHandler } from '../route-handlers/block-user-handler';
import { createActivityHandler } from '../route-handlers/create-activity-handler';
import { getUserByIdHandler } from '../route-handlers/get-user-by-id-handler';
import { createUserRatingHandler } from '../route-handlers/create-user-rating-handler';
import { updateUserRatingHandler } from '../route-handlers/update-user-rating-handler';
import { getUserActivitiesHandler } from '../route-handlers/get-user-activities-handler';
import { getActivityByIdHandler } from '../route-handlers/get-activity-by-id-handler';
import { getAttendanceOnEventHandler } from '../route-handlers/get-attendance-on-event-handler';
import { createAttendanceOnEventHandler } from '../route-handlers/create-attendance-on-event-handler';
import { deleteUserHandler } from '../route-handlers/delete-user-handler';

const router = getRouter();

router.get('/:userId', checkAuth, getUserByIdHandler);

router.post('/:userId/rating', checkAuth, verifyRating, createUserRatingHandler);
router.post('/:userId/block', checkAuth, blockUserHandler);

router.put('/:userId/rating', checkAuth, verifyRating, updateUserRatingHandler);
router.get('/:userId/activities', checkAuth, getUserActivitiesHandler);
router.post('/:userId/activities', checkAuth, createActivityHandler);
router.get('/:userId/activities/:activityId', checkAuth, getActivityByIdHandler);
router.get('/:userId/attendance/active', checkAuth, getActiveAttendanceHandler);
router.get('/:userId/attendance/:eventId', checkAuth, getAttendanceOnEventHandler);

router.put('/:userId/attendance/:eventId', checkAuth, updateAttendanceOnEventHandler);
router.post('/:userId/attendance/:eventId', checkAuth, createAttendanceOnEventHandler);
router.delete('/:userId', checkAuth, deleteUserHandler);

export { router as userRouter };
