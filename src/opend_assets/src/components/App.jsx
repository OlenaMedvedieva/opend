
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";

function App(props) {
  return (
    <div className="App">
      <Header opend={props.opend} buyerOpend={props.buyerOpend} />
      <Footer />
    </div>
  );
}

export default App;
