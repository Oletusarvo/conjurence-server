import db from '../../../../dbconfig';
import { ExpressRequest, ExpressResponse } from '../../../express-server-types';
import { tablenames } from '../../../tablenames';
import { createJWT } from '../util/create-jwt';
import { sendEmail } from '../util/send-email';
const packageName = 'Conjurence';

export default async function sendPasswordResetEmailHandler(
  req: ExpressRequest,
  res: ExpressResponse
) {
  try {
    const { email } = req.body;
    const userRecord = await db(tablenames.user).where({ email }).select('id', 'username').first();
    const token = createJWT({ user_id: userRecord.id }, { expiresIn: '1h' });
    await sendEmail({
      to: email,
      subject: `Reset Your ${packageName} password`,
      html: `
      <h1>Reset Your ${packageName} Password</h1>
      <strong>Hello ${userRecord.username}!</strong><br/><br/>

      <p>
        You have requested to reset your ${packageName} password.<br/>
        If it wasn't you, please ignore this message.<br/>
        Otherwise, <a href="${process.env.DOMAIN_URL}/login/reset?token=${token}">click here.</a><br/><br/>
        Best regards, the ${packageName} team.
      </p>
    `,
    });
    return res.status(200).end();
  } catch (err) {
    console.log(err.message);
    return res.status(500).end();
  }
}
