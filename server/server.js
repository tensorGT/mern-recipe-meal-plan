const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Recipe, MealPlan } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/recipe_planner";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.error("mongo error:", err.message));

app.get("/api/recipes", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.category && req.query.category !== "all") {
      query.category = req.query.category;
    }
    if (req.query.q) {
      query.title = { $regex: req.query.q, $options: "i" };
    }
    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    next(err);
  }
});

app.post("/api/recipes", async (req, res, next) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/meal-plans", async (req, res, next) => {
  try {
    const plans = await MealPlan.find().populate("recipe");
    res.json(plans);
  } catch (err) {
    next(err);
  }
});

app.post("/api/meal-plans", async (req, res, next) => {
  try {
    const plan = await MealPlan.create({ day: req.body.day, recipe: req.body.recipeId });
    const populated = await plan.populate("recipe").execPopulate();
    res.status(201).json(populated);
  } catch (err) {
