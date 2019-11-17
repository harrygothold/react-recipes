import React, { useEffect, useState } from "react";
import "./App.css";
import posed from "react-pose";

import { Query } from "react-apollo";
import { GET_ALL_RECIPES } from "../queries";
import RecipeItem from "./Recipe/RecipeItem";
import Spinner from "./Spinner";

const RecipeList = posed.ul({
  show: {
    x: "0%",
    staggerChildren: 100
  },
  hidden: {
    x: "-100%"
  }
});

const App = () => {
  const [toggle, setToggle] = useState();

  const slideIn = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    setTimeout(slideIn, 200);
  }, []);
  return (
    <div className="App">
      <h1 className="main-title">
        Find Recipes You <strong>Love</strong>
      </h1>
      <Query query={GET_ALL_RECIPES}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error) return <div>Error</div>;
          return (
            <RecipeList pose={toggle ? "show" : "hidden"} className="cards">
              {data.getAllRecipes.map(recipe => (
                <RecipeItem key={recipe._id} {...recipe} />
              ))}
            </RecipeList>
          );
        }}
      </Query>
    </div>
  );
};

export default App;
