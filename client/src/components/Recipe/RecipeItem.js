import React from "react";
import posed from "react-pose";
import { Link } from "react-router-dom";

const RecipeItem = posed.li({
  show: { opacity: 1 },
  hidden: { opacity: 0 }
});

export default ({ _id, imageUrl, name, category }) => (
  <RecipeItem
    className="card"
    style={{
      background: `url(${imageUrl}) center center / cover no-repeat`
    }}
  >
    <span className={category}>{category}</span>
    <div className="card-text">
      <Link to={`/recipes/${_id}`}>
        <h4>{name}</h4>
      </Link>
    </div>
  </RecipeItem>
);
