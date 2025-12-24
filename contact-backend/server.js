const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// Expected environment variables:
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO
const CONTACT_TO = process.env.CONTACT_TO || 'amoghvarsh9614@gmail.com';

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.warn('Warning: SMTP configuration is missing. Please set SMTP_HOST, SMTP_USER and SMTP_PASS in environment.');
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
  secure: process.env.SMTP_SECURE === 'true' || false,
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
});

app.post('/api/contact', async (req, res) => {
  const { name, phone, email, reason } = req.body || {};
  if (!name || !email || !reason) {
    return res.status(400).json({ error: 'Missing required fields: name, email, reason' });
  }

  const html = `
    <h3>New contact form submission</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong><br/>${reason.replace(/\n/g, '<br/>')}</p>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM || (process.env.SMTP_USER || 'contact@example.com'),
    to: CONTACT_TO,
    subject: `Portfolio contact form: ${name}`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Message sent' });
  } catch (err) {
    console.error('Mail error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.get('/', (req, res) => res.send('Contact backend running'));

app.listen(port, () => console.log(`Contact backend listening on http://localhost:${port}`));
