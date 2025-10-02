import { transport } from '../../../nodemailer.config';

require('dotenv').config();
/**Sends an email using the configured transport-object in the nodemailer.config file.*/
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  console.log(
    'Sending email; using these credentials: ',
    process.env.SMTP_EMAIL,
    process.env.SMTP_PASSWORD,
    process.env.SERVICE_EMAIL
  );
  const result = await transport.sendMail({
    from: process.env.SERVICE_EMAIL,
    to,
    subject,
    html,
  });
}
