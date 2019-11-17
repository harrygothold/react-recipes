import React, { useState } from "react";
import { Query, Mutation } from "react-apollo";
import {
  GET_USER_RECIPES,
  DELETE_USER_RECIPE,
  GET_ALL_RECIPES,
  GET_CURRENT_USER
} from "../../queries";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";

const UserRecipes = ({ username }) => {
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    category: "",
    description: ""
  });
  const [modal, setModal] = useState(false);
  const handleDelete = deleteUserRecipe => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (confirmDelete) {
      deleteUserRecipe().then(({ data }) => {
        // console.log(data);
      });
    }
  };

  const handleChange = e =>
    setFormData({
      [e.target.name]: e.target.value
    });

  const closeModal = () => setModal(false);

  return (
    <Query query={GET_USER_RECIPES} variables={{ username }}>
      {({ data, loading, error }) => {
        if (loading) return <Spinner />;
        if (error) return <div>Error</div>;
        return (
          <ul>
            {modal && (
              <EditRecipeModal
                closeModal={closeModal}
                handleChange={handleChange}
              />
            )}
            <h3>Your Recipes</h3>
            {!data.getUserRecipes.length && (
              <p>
                <strong>You have not added any recipes yet!</strong>
              </p>
            )}
            {data.getUserRecipes.map(recipe => (
              <li key={recipe._id}>
                <Link to={`/recipes/${recipe._id}`}>
                  <p>{recipe.name}</p>
                </Link>
                <p style={{ marginBottom: 0 }}>Likes: {recipe.likes}</p>
                <Mutation
                  mutation={DELETE_USER_RECIPE}
                  variables={{ _id: recipe._id }}
                  refetchQueries={() => [
                    { query: GET_ALL_RECIPES },
                    { query: GET_CURRENT_USER }
                  ]}
                  update={(cache, { data: { deleteUserRecipe } }) => {
                    const { getUserRecipes } = cache.readQuery({
                      query: GET_USER_RECIPES,
                      variables: { username }
                    });
                    cache.writeQuery({
                      query: GET_USER_RECIPES,
                      variables: { username },
                      data: {
                        getUserRecipes: getUserRecipes.filter(
                          recipe => recipe._id !== deleteUserRecipe._id
                        )
                      }
                    });
                  }}
                >
                  {(deleteUserRecipe, attrs = {}) => (
                    <div>
                      <button
                        onClick={() => setModal(true)}
                        className="button-primary"
                      >
                        Update
                      </button>
                      <p
                        onClick={() => handleDelete(deleteUserRecipe)}
                        className="delete-button"
                      >
                        {attrs.loading ? "Deleting..." : "X"}
                      </p>
                    </div>
                  )}
                </Mutation>
              </li>
            ))}
          </ul>
        );
      }}
    </Query>
  );
};

const EditRecipeModal = ({ handleChange, closeModal }) => (
  <div className="modal modal-open">
    <div className="modal-inner">
      <div className="modal-content">
        <form className="modal-content-inner">
          <h4>Edit Recipe</h4>
          <label htmlFor="name">Recipe Name</label>
          <input type="text" name="name" onChange={handleChange} />
          <label htmlFor="imageUrl">Recipe Image</label>
          <input type="text" name="imageUrl" onChange={handleChange} />
          <label htmlFor="category">Category of Recipe</label>
          <select name="category" onChange={handleChange}>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
          <label htmlFor="description">Recipe Description</label>
          <input type="text" name="description" onChange={handleChange} />
          <hr />
          <div className="modal-buttons">
            <button type="submit" className="button-primary">
              Update
            </button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export default UserRecipes;
