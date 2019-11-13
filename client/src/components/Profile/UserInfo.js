import React from "react";
import { Link } from "react-router-dom";

const formatDate = date => {
  const newDate = new Date(date).toLocaleDateString("en-UK");
  const newTime = new Date(date).toLocaleTimeString("en-UK");
  return `${newDate} at ${newTime}`;
};

const UserInfo = ({ session: { getCurrentUser } }) => {
  return (
    <div>
      <h3>User Info</h3>
      <p>Username: {getCurrentUser.username}</p>
      <p>Email: {getCurrentUser.email}</p>
      <p>Join Date: {formatDate(getCurrentUser.joinDate)}</p>
      <ul>
        <h3>{getCurrentUser.username}'s Favourites</h3>
        {getCurrentUser.favorites.map(favorite => (
          <li key={favorite._id}>
            <Link to={`/recipes/${favorite._id}`}>
              <p>{favorite.name}</p>
            </Link>
          </li>
        ))}
        {!getCurrentUser.favorites.length && (
          <p>You have no favorites. Go add some!</p>
        )}
      </ul>
    </div>
  );
};

export default UserInfo;
