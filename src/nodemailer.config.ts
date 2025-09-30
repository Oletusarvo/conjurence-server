import nodemailer from 'nodemailer';

const transportOptions = {
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
};

export const transport = nodemailer.createTransport(transportOptions);
