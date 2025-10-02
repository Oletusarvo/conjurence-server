import axios from 'axios';
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
  const res = await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: { email: process.env.SERVICE_EMAIL, name: 'Conjurence App' },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    },
    {
      headers: {
        'api-key': process.env.EMAIL_API_KEY.trim(),
        'Content-Type': 'application/json',
      },
    }
  );

  /*
  const result = await transport.sendMail({
    from: process.env.SERVICE_EMAIL,
    to,
    subject,
    html,
  });*/
}
