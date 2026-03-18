require('dotenv').config();
const express = require('express');
const cors = require('cors');
const aggregateRoutes = require('./routes/aggregate');

const app = express();
app.use(express.json());
app.use(cors()); // Allow React frontend to call this service

const PORT = process.env.PORT || 4000;

app.use('/api', aggregateRoutes);
app.get('/health', (req, res) => res.json({ status: 'OK', service: 'aggregator-service' }));

app.listen(PORT, () => console.log(`[aggregator-service] Running on port ${PORT}`));
