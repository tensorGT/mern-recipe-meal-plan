const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    ingredients: [{ type: String, required: true }],
    instructions: { type: String, default: "" },
  },
  { timestamps: true }
);

const mealPlanSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
  },
  { timestamps: true }
);
