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
  }

  async function addToPlan(recipeId) {
    const res = await fetch(`${API}/meal-plans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day: selectedDay, recipeId }),
    });
    if (res.ok) loadAll();
  }

  return (
    <div style={{ maxWidth: 820, margin: "28px auto", fontFamily: "Arial, sans-serif", padding: "0 16px" }}>
      <h1>Recipe &amp; Meal Planner</h1>

      <form onSubmit={addRecipe} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <input placeholder="Recipe name" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <select value={newCat} onChange={(e) => setNewCat(e.target.value)}>
          <option value="breakfast">breakfast</option>
          <option value="lunch">lunch</option>
          <option value="dinner">dinner</option>
        </select>
        <input
          placeholder="Ingredients (comma separated)"
          value={ingredientsText}
          onChange={(e) => setIngredientsText(e.target.value)}
          required
        />
        <button type="submit">Add Recipe</button>
      </form>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input placeholder="Search recipes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">all</option>
          <option value="breakfast">breakfast</option>
          <option value="lunch">lunch</option>
          <option value="dinner">dinner</option>
        </select>
        <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
          {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <h2>Recipes</h2>
      <ul>
        {recipes.map((r) => (
          <li key={r._id} style={{ marginBottom: 8 }}>
            <strong>{r.title}</strong> ({r.category}) — {r.ingredients.join(", ")}{" "}
            <button type="button" onClick={() => addToPlan(r._id)}>+ Add to {selectedDay}</button>
          </li>
        ))}
      </ul>

      <h2>Saved Meal Plan</h2>
      <ul>
        {plans.map((p) => (
          <li key={p._id}>{p.day}: {p.recipe ? p.recipe.title : "Deleted recipe"}</li>
        ))}
      </ul>
    </div>
  );
}
