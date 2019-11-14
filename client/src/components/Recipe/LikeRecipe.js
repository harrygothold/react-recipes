import React, { Component } from "react";
import { Mutation } from "react-apollo";
import withSession from "../withSession";
import { LIKE_RECIPE } from "../../queries";

class LikeRecipe extends Component {
  state = {
    username: "",
    liked: false
  };

  componentDidMount() {
    if (this.props.session.getCurrentUser) {
      const { username, favorites } = this.props.session.getCurrentUser;
      console.log(favorites);
      const { _id } = this.props;
      const prevLiked =
        favorites.findIndex(favorite => favorite._id === _id) > -1;
      this.setState({ username, liked: prevLiked });
    }
  }

  handleClick = likeRecipe => {
    this.setState(
      prevState => ({
        liked: !prevState.liked
      }),
      () => {
        this.handleLike(likeRecipe);
      }
    );
  };

  handleLike = likeRecipe => {
    if (this.state.liked) {
      likeRecipe().then(async ({ data }) => {
        console.log(data);
        await this.props.refetch();
      });
    } else {
      // unlike recipe mutation
      console.log("unlike");
    }
  };

  render() {
    const { username, liked } = this.state;
    const { _id } = this.props;
    return (
      <Mutation mutation={LIKE_RECIPE} variables={{ _id, username }}>
        {likeRecipe =>
          username && (
            <button onClick={() => this.handleClick(likeRecipe)}>
              {liked ? "Liked" : "Like"}
            </button>
          )
        }
      </Mutation>
    );
  }
}

export default withSession(LikeRecipe);
