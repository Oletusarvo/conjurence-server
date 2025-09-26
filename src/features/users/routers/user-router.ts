import { getRouter } from '../../../util/get-router';
import { checkAuth } from '../../auth/util/check-auth';
import createAttendanceOnEventHandler from '../route-handlers/create-attendance-on-event-handler';
import deleteUserHandler from '../route-handlers/delete-user-handler';
import { getActiveAttendanceHandler } from '../route-handlers/get-active-attendance-handler';
import getAttendanceOnEventHandler from '../route-handlers/get-attendance-on-event-handler';
import getEventTemplateByIdHandler from '../route-handlers/get-event-template-by-id-handler';
import getEventTemplatesHandler from '../route-handlers/get-event-templates-handler';
import { updateAttendanceOnEventHandler } from '../route-handlers/update-attendance-on-event-handler';

const router = getRouter();

router.get('/:userId/event-templates', checkAuth, getEventTemplatesHandler);
router.get('/:userId/event-templates/:templateId', checkAuth, getEventTemplateByIdHandler);
router.get('/:userId/attendance/active', checkAuth, getActiveAttendanceHandler);
router.get('/:userId/attendance/:eventId', checkAuth, getAttendanceOnEventHandler);

router.put('/:userId/attendance/:eventId', checkAuth, updateAttendanceOnEventHandler);
router.post('/:userId/attendance/:eventId', checkAuth, createAttendanceOnEventHandler);
router.delete('/:userId', checkAuth, deleteUserHandler);

export { router as userRouter };
