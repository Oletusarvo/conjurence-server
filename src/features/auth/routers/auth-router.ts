import { getRouter } from '../../../util/get-router';
import { getSessionHandler } from '../route-handlers/get-session-handler';
import { getHandler, postHandler } from '../route-handlers/login-handler';
import { logoutHandler } from '../route-handlers/logout-handler';
import { patchSessionHandler } from '../route-handlers/patch-session.handler';
import { registerHandler } from '../route-handlers/register-handler';
import resetPasswordHandler from '../route-handlers/reset-password-handler';
import sendPasswordResetEmailHandler from '../route-handlers/send-password-reset-email-handler';
import { sendVerificationEmailHandler } from '../route-handlers/send-verification-email';
import { checkAuth } from '../util/check-auth';

const router = getRouter();
router.get('/login', getHandler);
router.post('/login', postHandler);
router.post('/register', registerHandler);
router.post('/reset-password/verify', sendPasswordResetEmailHandler);
router.post('/reset-password', resetPasswordHandler);
router.post('/verify', sendVerificationEmailHandler);
router.get('/logout', logoutHandler);
router.get('/session', checkAuth, getSessionHandler);
router.patch('/session', checkAuth, patchSessionHandler);

export { router as authRouter };
