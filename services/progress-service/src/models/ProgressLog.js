const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    weightKg: Number,
    bodyFatPct: Number,
    workoutCompleted: { type: Boolean, default: false },
    exerciseLogs: [
      {
        exercise: String,
        sets: Number,
        reps: Number,
        weightKg: Number,
      },
    ],
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProgressLog', progressLogSchema);
