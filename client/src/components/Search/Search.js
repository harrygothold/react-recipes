import React, { useState } from "react";
import { ApolloConsumer } from "react-apollo";
import { SEARCH_RECIPES } from "../../queries";
import SearchItem from "./SearchItem";

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = ({ searchRecipes }) => {
    setSearchResults(searchRecipes);
  };
  return (
    <ApolloConsumer>
      {client => {
        return (
          <div className="App">
            <input
              className="search"
              type="search"
              placeholder="Search for Recipes"
              onChange={async e => {
                e.persist();
                const { data } = await client.query({
                  query: SEARCH_RECIPES,
                  variables: { searchTerm: e.target.value }
                });
                handleChange(data);
              }}
            />
            <ul>
              {searchResults.map(recipe => (
                <SearchItem key={recipe._id} {...recipe} />
              ))}
            </ul>
          </div>
        );
      }}
    </ApolloConsumer>
  );
};

export default Search;
