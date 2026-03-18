require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const workoutRoutes = require('./routes/workout');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/workout_db';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('[workout-service] MongoDB connected'))
  .catch((err) => { console.error(err.message); process.exit(1); });

app.use('/workout', workoutRoutes);
app.get('/health', (req, res) => res.json({ status: 'OK', service: 'workout-service' }));
app.listen(PORT, () => console.log(`[workout-service] Running on port ${PORT}`));
