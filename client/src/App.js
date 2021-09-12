import React, { useEffect, useState } from "react";

const API = "http://localhost:5001/api";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [title, setTitle] = useState("");
  const [newCat, setNewCat] = useState("dinner");
  const [ingredientsText, setIngredientsText] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");

  async function loadAll() {
    const [rRes, pRes] = await Promise.all([
      fetch(`${API}/recipes?category=${encodeURIComponent(category)}&q=${encodeURIComponent(search)}`),
      fetch(`${API}/meal-plans`),
    ]);
    if (rRes.ok) setRecipes(await rRes.json());
    if (pRes.ok) setPlans(await pRes.json());
  }

  useEffect(() => {
    loadAll();
  }, [category, search]);

  async function addRecipe(e) {
    e.preventDefault();
    const ingredients = ingredientsText.split(",").map((s) => s.trim()).filter(Boolean);
    const res = await fetch(`${API}/recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category: newCat, ingredients }),
    });
    if (res.ok) {
      setTitle("");
      setIngredientsText("");
      loadAll();
    }
