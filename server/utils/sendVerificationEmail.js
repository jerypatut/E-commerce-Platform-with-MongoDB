const sendEmail = require('./sendEmail');

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please Confirmation your email by clicking on the following Link:<a href="${verifyEmail}">Veryfi Email Right now</a></p>`;
  return sendEmail({
    to: email,
    subject: 'Email Confirmation',
    html: `<h4>Hello ${name}</h4>
    ${message}`,
  });
};

module.exports = sendVerificationEmail;
