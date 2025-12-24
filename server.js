import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 5000;

// Security + middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiter for contact endpoint
const contactLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // Increased limit for easier testing
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

// Mail transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
});

const CONTACT_TO = process.env.CONTACT_TO || 'amoghvarsh9614@gmail.com';

// Root health
app.get('/', (req, res) => {
    res.send('Portfolio server is running');
});

// Contact endpoint (with honeypot + validation + rate limit)
app.post('/api/contact', contactLimiter, async (req, res) => {
    const { name, phone, email, reason, _hp } = req.body || {};

    // Honeypot: if filled, likely a bot
    if (_hp) return res.status(400).json({ error: 'Spam detected' });

    if (!name || !email || !reason) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Basic validation
    if (typeof name !== 'string' || name.length < 2) return res.status(400).json({ error: 'Invalid name' });
    if (typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });

    const html = `
        <h3>New contact form submission</h3>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || 'N/A')}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong><br/>${escapeHtml(reason).replace(/\n/g, '<br/>')}</p>
    `;

    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com',
        to: CONTACT_TO,
        subject: `Portfolio contact form: ${name}`,
        html,
    };

    try {
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
            console.log('--- TEST MODE: No SMTP credentials found ---');
            console.log('Message details:');
            console.log(`From: ${name} (${email})`);
            console.log(`Reason: ${reason}`);
            console.log('-------------------------------------------');
            return res.json({ success: true, message: 'Message received (Test Mode: active)' });
        }

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Message sent' });
    } catch (err) {
        console.error('Mail error:', err);
        res.status(500).json({ error: 'Failed to send email. Check backend logs for details.' });
    }
});

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (s) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" })[s];
    });
}

// Start server
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));