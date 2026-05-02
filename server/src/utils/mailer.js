import nodemailer from 'nodemailer';

let transporter = null;
let initialized = false;

const initializeTransporter = () => {
  if (initialized) return;
  initialized = true;

  const emailUser = process.env.EMAIL_USER;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const refreshToken = process.env.REFRESH_TOKEN;

  // Prefer OAuth2 if available
  const useOAuth2 = Boolean(clientId && clientSecret && refreshToken);

  if (!emailUser) {
    console.error('✗ EMAIL_USER not set in .env');
    return;
  }

  if (!useOAuth2) {
    console.error('✗ OAuth2 credentials (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN) not set in .env');
    return;
  }

  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: emailUser,
        clientId,
        clientSecret,
        refreshToken,
      },
    });

    transporter.verify((error) => {
      if (error) {
        console.error('✗ Email server connection failed:', error.message);
      } else {
        console.log('✓ Email server is ready (OAuth2)');
      }
    });
  } catch (error) {
    console.error('✗ Email transporter creation failed:', error.message);
    transporter = null;
  }
};

export const sendScheduledMessageEmail = async ({ to, contactName, message }) => {
  initializeTransporter();

  if (!transporter) {
    console.error('✗ Transporter not initialized. Email not sent.');
    throw new Error('Email transporter not initialized');
  }

  const senderEmail = process.env.EMAIL_USER;

  const mailOptions = {
    from: senderEmail,
    to,
    subject: `Message from Last Word for ${contactName}`,
    text: `Hello ${contactName},\n\nYou have a message from Last Word:\n\n${message}`,
    html: `<p>Hello ${contactName},</p><p>You have a message from Last Word:</p><p>${message}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Email sent to ${to} (Message ID: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error(`✗ Failed to send email to ${to}:`, error.message);
    throw error;
  }
};
