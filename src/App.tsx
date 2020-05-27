import "./App.css";

import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import fetch from "isomorphic-fetch";
import React from "react";

import { graphqlBase } from "./config";

const App = () => {
  const client = new ApolloClient({
    link: createHttpLink({
      uri: graphqlBase,
      fetch,
    }),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>App</ApolloProvider>;
};

export default App;
