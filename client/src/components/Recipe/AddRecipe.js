import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from "../../queries";
import Error from "../Error";
import withAuth from "../withAuth";

const initialState = {
  name: "",
  category: "Breakfast",
  description: "",
  instructions: "",
  username: ""
};
class AddRecipe extends Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({
      ...initialState
    });
  };

  componentDidMount() {
    this.setState({
      username: this.props.session.getCurrentUser.username
    });
  }

  handleChange = e =>
    this.setState({
      [e.target.name]: e.target.value
    });

  validateForm = () => {
    const { name, category, description, instructions } = this.state;
    const isInvalid = !name || !category || !description || !instructions;
    return isInvalid;
  };

  handleSubmit = (e, addRecipe) => {
    e.preventDefault();
    addRecipe().then(({ data }) => {
      this.clearState();
      this.props.history.push("/");
    });
  };

  updateCache = (cache, { data: { addRecipe } }) => {
    // Reads GQL query from root query id
    const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });
    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getAllRecipes: [addRecipe, ...getAllRecipes]
      }
    });
  };

  render() {
    const { name, category, description, instructions, username } = this.state;
    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{ name, category, description, instructions, username }}
        refetchQueries={() => [
          { query: GET_USER_RECIPES, variables: { username } }
        ]}
        update={this.updateCache}
      >
        {(addRecipe, { data, loading, error }) => {
          return (
            <div className="App">
              <h2 className="App">Add Recipe</h2>
              <form
                className="form"
                onSubmit={e => this.handleSubmit(e, addRecipe)}
              >
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                />
                <select
                  value={category}
                  onChange={this.handleChange}
                  name="category"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <input
                  type="text"
                  value={description}
                  onChange={this.handleChange}
                  name="description"
                  placeholder="Add Description"
                />
                <textarea
                  name="instructions"
                  value={instructions}
                  onChange={this.handleChange}
                  placeholder="Add Instructions"
                ></textarea>
                <button
                  disabled={loading || this.validateForm()}
                  className="button-primary"
                  type="submit"
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withAuth(session => session && session.getCurrentUser)(
  withRouter(AddRecipe)
);
