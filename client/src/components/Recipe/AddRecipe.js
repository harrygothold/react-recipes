import React, { useState } from "react";

const AddRecipe = () => {
  const [recipeData, setRecipeData] = useState({
    name: "",
    category: "Breakfast",
    description: "",
    instructions: ""
  });

  const handleChange = e =>
    setRecipeData({
      ...recipeData,
      [e.target.name]: e.target.value
    });

  const { name, category, description, instructions } = recipeData;

  return (
    <div className="App">
      <h2 className="App">Add Recipe</h2>
      <form className="form">
        <input type="text" name="name" value={name} onChange={handleChange} />
        <select value={category} onChange={handleChange} name="category">
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snack">Snack</option>
        </select>
        <input
          type="text"
          value={description}
          onChange={handleChange}
          name="description"
          placeholder="Add Description"
        />
        <textarea
          name="instructions"
          value={instructions}
          onChange={handleChange}
          placeholder="Add Instructions"
        ></textarea>
        <button className="button-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
