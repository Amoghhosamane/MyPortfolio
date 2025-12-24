Contact Backend Deployment

Options provided below: Render (recommended), Vercel Serverless, or Docker-based deploy.

Render (quick):
- Create a new Web Service on Render.
- Connect your GitHub repo and point to the repository root.
- Set the build command: `npm install && npm run build || true`
- Set the start command: `node server.js`
- Set environment variables in Render dashboard: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`, `SMTP_FROM`.

Vercel (serverless functions):
- Vercel prefers serverless functions. Convert `/api/contact` into a serverless function (e.g., `api/contact.js`) and use `nodemailer` with SMTP or use a transactional email provider.

Docker (container):
- Add a `Dockerfile` and push to a container host (AWS ECS, DigitalOcean App Platform, etc.).

Example `Dockerfile` (root):

```
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

Notes:
- For Gmail use an App Password and set `SMTP_USER` to your Gmail address and `SMTP_PASS` to App Password.
- Keep SMTP credentials secret.
- Test locally with `SMTP_HOST=smtp.example.com SMTP_USER=... SMTP_PASS=... node server.js`.
