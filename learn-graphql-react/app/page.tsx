"use client";
import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Students from "@/components/Student";

const client = new ApolloClient({
  uri: "http://localhost:4000", // Your GraphQL server endpoint
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Students</h1>
        <Students />
      </div>
    </ApolloProvider>
  );
};

export default App;
