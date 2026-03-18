const mongoose = require('mongoose');

const dietEntrySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
    foodItems: [
      {
        name: String,
        calories: Number,
        proteinG: Number,
        carbsG: Number,
        fatG: Number,
      },
    ],
    totalCalories: Number,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('DietEntry', dietEntrySchema);
