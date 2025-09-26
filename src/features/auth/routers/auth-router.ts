import { getRouter } from '../../../util/get-router';
import { getSessionHandler } from '../route-handlers/get-session-handler';
import { getHandler, postHandler } from '../route-handlers/login-handler';
import { logoutHandler } from '../route-handlers/logout-handler';
import { patchSessionHandler } from '../route-handlers/patch-session.handler';
import { registerHandler } from '../route-handlers/register-handler';
import { checkAuth } from '../util/check-auth';

const router = getRouter();
router.get('/login', getHandler);
router.post('/login', postHandler);
router.post('/register', registerHandler);
router.get('/logout', logoutHandler);
router.get('/session', checkAuth, getSessionHandler);
router.patch('/session', checkAuth, patchSessionHandler);

export { router as authRouter };
