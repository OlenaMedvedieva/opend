
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../declarations/opend";

const init = async () => {
  const agent = new HttpAgent({
    host: "http://127.0.0.1:8000",
  });

  await agent.fetchRootKey();

  const opendActor = Actor.createActor(idlFactory, {
    agent,
    canisterId: "rrkah-fqaaa-aaaaa-aaaaq-cai",
  });

  console.log("OPEND ACTOR CREATED");

  ReactDOM.render(
    <App />,
    document.getElementById("root")
  );
};

init();

