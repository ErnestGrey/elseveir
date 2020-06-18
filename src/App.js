import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useFetch } from "./hooks/useFetch";

function App() {
  const sandboxUrl =
    "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Patient/1316024";
  var obj = {
    method: "GET",
    headers: {
      Accept: "application/json+fhir",
    },
  };
  const [response, loading, hasError] = useFetch(sandboxUrl, obj);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : hasError ? (
        <div>Error occured.</div>
      ) : (
        <div>{response?.resourceType}</div>
      )}
    </>
  );
}

export default App;
