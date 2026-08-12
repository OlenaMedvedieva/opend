
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../declarations/opend";
import { buyerIdentity } from "./buyerIdentity";

const init = async () => {
  const agent = new HttpAgent({
    host: "http://127.0.0.1:8000",
identity: buyerIdentity,
  });

  await agent.fetchRootKey();

  const opendActor = Actor.createActor(idlFactory, {
    agent,
    canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
  });

  const opendBuyerActor = Actor.createActor(idlFactory, {
    agent,
    canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
  });

  console.log("OPEND ACTOR CREATED");

  ReactDOM.render(
    <App
      opend={opendActor}
      buyerOpend={opendBuyerActor}
      identity={buyerIdentity}
    />,
    document.getElementById("root")
  );
};

init();

