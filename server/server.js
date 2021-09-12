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
