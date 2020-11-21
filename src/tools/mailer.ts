import { createTransport } from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import { EmailServiceError } from "../utils/errors";

const from = "Jayant Malik @devjayantmalik <dev.jayantmalik@gmail.com>";

// TODO: Make sure to replace in production.
const transporter = createTransport({
  host: "localhost",
  port: 25,
  secure: false,
  from
});

const send_email = async (mailOptions: MailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return reject(EmailServiceError(err.message));
      return resolve(info);
    });
  });
};

export const send_welcome_email = async (to: string) => {
  await send_email({
    from,
    to: to,
    html: "<h1>Welcome to the Reddit Site.</h1>"
  });
};

export const send_signup_account_confirmation_email = async (code: string, to: string) => {
  await send_email({
    from,
    to: to,
    html: `<p>Your Signup One Time Passcode is: ${code}</p>`
  });
};

export const send_signin_otp_verify_email = async (code: string, to: string) => {
  await send_email({
    from,
    to: to,
    html: `<p>Your Signin One Time Passcode is: ${code}</p>`
  });
};

export const send_reset_password_email = async (code: string, to: string) => {
  await send_email({
    from,
    to: to,
    html: `<p>Your Password Reset Code is: ${code}</p>`
  });
};
