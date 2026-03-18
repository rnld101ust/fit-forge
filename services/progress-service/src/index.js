require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const progressRoutes = require('./routes/progress');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5005;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/progress_db';
const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('[progress-service] MongoDB connected'))
  .catch((err) => { console.error(err.message); process.exit(1); });

// Redis publisher — used by routes to push events
const redisClient = new Redis({ host: REDIS_HOST, port: Number(REDIS_PORT) });
redisClient.on('error', (err) => console.warn('[progress-service] Redis error:', err.message));

// Attach to app so routes can access it
app.locals.redis = redisClient;

app.use('/progress', progressRoutes);
app.get('/health', (req, res) => res.json({ status: 'OK', service: 'progress-service' }));
app.listen(PORT, () => console.log(`[progress-service] Running on port ${PORT}`));
