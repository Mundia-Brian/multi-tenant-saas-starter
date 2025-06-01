// Automation Service - Lead Nurture & Follow-up Engine
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const Redis = require('ioredis');

const app = express();
const PORT = process.env.PORT || 6000;

const redis = new Redis(process.env.REDIS_URL);
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  tls: { rejectUnauthorized: false },
});

app.use((req, res, next) => {
  req.tenantId = req.hostname.split('.')[0];
  next();
});

app.post('/api/automate', async (req, res) => {
  const { to, subject, content } = req.body;
  try {
    await transporter.sendMail({
      from: `${req.tenantId}@yourdomain.com`,
      to,
      subject: `[${req.tenantId}] ${subject}`,
      html: `<p>${content}</p>`
    });
    await redis.lpush(`automation_log:${req.tenantId}`, JSON.stringify({ to, subject, content, time: Date.now() }));
    res.json({ sent: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to send automation' });
  }
});

app.listen(PORT, () => console.log(`Automation service running on port ${PORT}`));
