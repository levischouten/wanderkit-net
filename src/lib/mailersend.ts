import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "",
});

const sentFrom = new Sender("MS_nV2Fmw@wanderkit.net", "Info");

export async function sendEmail(
  subject: string,
  html: string,
  text: string,
  recipients: Recipient[]
) {
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setHtml(html)
    .setText(text);

  await mailerSend.email.send(emailParams);
}
