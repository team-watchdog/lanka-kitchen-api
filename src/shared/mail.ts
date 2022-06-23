import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ?  process.env.SENDGRID_API_KEY : "";

sgMail.setApiKey(SENDGRID_API_KEY);

export const MailTemplates = {
    PasswordResetTemplateId: '49d490f41d9d4fa38f977152a9d42c86',
}