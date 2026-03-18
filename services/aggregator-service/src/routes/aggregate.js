const express = require('express');
const axios = require('axios');
const router = express.Router();

// Service URLs resolved via Docker Compose / K8s DNS
const AUTH_URL      = process.env.AUTH_URL      || 'http://auth-service:5001';
const USER_URL      = process.env.USER_URL      || 'http://user-service:5002';
const WORKOUT_URL   = process.env.WORKOUT_URL   || 'http://workout-service:5003';
const NUTRITION_URL = process.env.NUTRITION_URL || 'http://nutrition-service:5004';
const PROGRESS_URL  = process.env.PROGRESS_URL  || 'http://progress-service:5005';

// ── Auth ──────────────────────────────────────────────────────────
// POST /api/auth/signup
router.post('/auth/signup', async (req, res) => {
  try {
    const { data } = await axios.post(`${AUTH_URL}/auth/signup`, req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: err.message });
  }
});

// POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const { data } = await axios.post(`${AUTH_URL}/auth/login`, req.body);
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: err.message });
  }
});

// ── Dashboard (aggregated) ────────────────────────────────────────
// GET /api/dashboard/:userId
router.get('/dashboard/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [profile, workouts, diet, progress] = await Promise.allSettled([
      axios.get(`${USER_URL}/users/${userId}`),
      axios.get(`${WORKOUT_URL}/workout/plans/${userId}`),
      axios.get(`${NUTRITION_URL}/nutrition/diet/${userId}`),
      axios.get(`${PROGRESS_URL}/progress/summary/${userId}`),
    ]);

    res.json({
      profile:  profile.status  === 'fulfilled' ? profile.value.data  : null,
      workouts: workouts.status === 'fulfilled' ? workouts.value.data : [],
      diet:     diet.status     === 'fulfilled' ? diet.value.data     : [],
      progress: progress.status === 'fulfilled' ? progress.value.data : [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── User Profile ──────────────────────────────────────────────────
router.put('/users/:userId', async (req, res) => {
  try {
    const { data } = await axios.put(`${USER_URL}/users/${req.params.userId}`, req.body);
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: err.message });
  }
});

// ── Workout Plans ─────────────────────────────────────────────────
router.post('/workout/plans', async (req, res) => {
  try {
    const { data } = await axios.post(`${WORKOUT_URL}/workout/plans`, req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: err.message });
  }
});

router.delete('/workout/plans/:planId', async (req, res) => {
  try {
    const { data } = await axios.delete(`${WORKOUT_URL}/workout/plans/${req.params.planId}`);
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: err.message });
  }
});

// ── Nutrition ─────────────────────────────────────────────────────
router.post('/nutrition/diet', async (req, res) => {
  try {
    const { data } = await axios.post(`${NUTRITION_URL}/nutrition/diet`, req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: err.message });
  }
});

// ── Progress ──────────────────────────────────────────────────────
router.post('/progress/log', async (req, res) => {
  try {
    const { data } = await axios.post(`${PROGRESS_URL}/progress/log`, req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: err.message });
  }
});

module.exports = router;
