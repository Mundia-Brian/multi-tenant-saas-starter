// Express + Multi-Tenant Backend Starter
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const Redis = require('ioredis');

const app = express();
const PORT = process.env.PORT || 4000;

const db = new Pool({ connectionString: process.env.DB_URL });
const redis = new Redis(process.env.REDIS_URL);

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  const hostname = req.hostname;
  const subdomain = hostname.split('.')[0];
  req.tenantId = subdomain;
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', tenant: req.tenantId });
});

app.post('/api/leads', async (req, res) => {
  const { email, name } = req.body;
  try {
    const insert = await db.query(
      'INSERT INTO leads (tenant, email, name) VALUES ($1, $2, $3) RETURNING id',
      [req.tenantId, email, name]
    );
    res.json({ success: true, id: insert.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save lead' });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
