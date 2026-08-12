
import React, { useState, useEffect } from "react";
import ItemComponent from "./Item";

function Gallery(props) {
  const [items, setItems] = useState();

  console.log("Gallery IDs:", props.ids);
  console.log("Gallery ROLE:", props.role);

  function fetchNFTs() {
    if (props.ids != undefined) {
      setItems(
        props.ids.map((NFTId) => (
          <ItemComponent
            key={NFTId}
            id={NFTId}
            role={props.role}
            opend={props.opend}
          />
        ))
      );
    }
  }

  useEffect(() => {
    fetchNFTs();
  }, [props.ids, props.role]);

  return (
    <div>
      <h2>{props.title}</h2>

      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {items}
          </div>
        </div>
      </div>
    </div>
  
  );
}

export default Gallery;
