Contact Backend
================

Simple Express backend to receive contact form submissions and forward them via SMTP email.

Setup
-----

1. Install dependencies:

```bash
cd contact-backend
npm install
```

2. Create a `.env` (or set env vars) with:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=sender@example.com
CONTACT_TO=amoghvarsh9614@gmail.com
PORT=4001
```

3. Run in development:

```bash
npm run dev
```

Note: For Gmail you may need an App Password or OAuth. Keep your credentials secure.

Endpoint
--------

- `POST /api/contact` JSON body: `{ name, phone, email, reason }`
