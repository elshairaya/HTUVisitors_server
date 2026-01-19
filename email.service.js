import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendAccessCodeEmail = async ({
  to,
  visitorName,
  accessCode,
  hostName,
  expectedCheckout,
}) => {
  await sgMail.send({
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "HTU Visitor Access Code",
    html: `
      <h2>HTU Visitor Management</h2>
      <p>Hello ${visitorName},</p>
      <p>Your access code is:</p>
      <h3>${accessCode}</h3>
      <p>Host: ${hostName}</p>
      <p>Expected checkout: ${new Date(expectedCheckout).toLocaleString()}</p>
    `,
  });
};
