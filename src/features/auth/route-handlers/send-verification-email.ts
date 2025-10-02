import db from '../../../../dbconfig';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { authService } from '../services/auth-service';
import { createJWT } from '../util/create-jwt';
import { sendEmail } from '../util/send-email';

const packageName = 'Conjurence';

export async function sendVerificationEmailHandler(req: ExpressRequest, res: ExpressResponse) {
  try {
    const { email } = req.body;

    const user = await authService.repo.findUserByEmail(email, db);
    if (user) {
      return res.status(409).end();
    }

    const token = createJWT(
      { email },
      {
        expiresIn: '1d',
      }
    );

    /**TODO: Update the url to be a deep link to the app. */
    await sendEmail({
      to: email,
      subject: 'Verify Your Account',
      html: `
      <h1>Verify Your Email</h1>
      <strong>Hi there!</strong>
      <p>
        It seems you have requested to sign up to <a href="${process.env.DOMAIN_URL}"><strong>${packageName}.</strong></a><br/>
        If it was not you who signed up, you can safely ignore this message.<br/><br/>
        Otherwise please click <a href="${process.env.DOMAIN_URL}/register?token=${token}">this link</a> to continue the registration process.<br/>
        Please note that the link will open the app directly, so it has to be installed beforehand.
        <br/><br/>
        Best regards, the ${packageName} team.
      </p>
    `,
    });
    return res.status(200).end();
  } catch (err) {
    console.log('send-email-verification-handler: ', err.message);
    return res.status(500).end();
  }
}
