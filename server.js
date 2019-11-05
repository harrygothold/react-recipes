const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./variables.env" });
const Recipe = require("./models/Recipe");
const User = require("./models/User");

// Bring in graphql express middleware
const { graphiqlExpress, graphqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");

// Create graphql schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.error(err));

const app = express();

// Create graphical application
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// Connect schemas with graphql
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: {
      Recipe,
      User
    }
  })
);

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
