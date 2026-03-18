const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: String,
    age: Number,
    weightKg: Number,
    heightCm: Number,
    fitnessGoal: { type: String, enum: ['lose_weight', 'build_muscle', 'maintain', 'endurance'], default: 'maintain' },
    bio: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
