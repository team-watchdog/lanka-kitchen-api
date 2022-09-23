import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ?  process.env.SENDGRID_API_KEY : "";

sgMail.setApiKey(SENDGRID_API_KEY);

export const MailTemplates = {
    PasswordResetTemplateId: 'd-804aa0e03d1444cca2a3f21b76792b90',
    InviteTemplateId: 'd-58dca3836f584ba2ae82e2ba8038632c',
}