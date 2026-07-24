import React from "react";
import logo from "../../assets/logo.png";
import {Actor, HttpAgent} from "@dfinity/agent";
import {idlFactory} from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";


function Item(props) {

  const [name, setName] = React.useState("");
  const [owner, setOwner] = React.useState("");
  const [image, setImage] = React.useState("");

  const id = Principal.fromText( props.id);


const localhost = "http://localhost:8080";
  const agent = new HttpAgent({ host: localhost});

  async function loadNFT() {
    const NFTActor = await Actor.createActor(idlFactory, {  
      agent,
      canisterId:id , 
    });

    const name = await NFTActor.getName();
    const owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(new Blob([imageContent.buffer], { type: "image/png" }));
    setName(name);
    setOwner(owner.toText());
    setImage(image);
  }

    React.useEffect(() => {
      loadNFT();
    }, []);


  return (
      <div>
    <h1>{name}</h1>
    <p>{owner}</p>
    <img src={image} />
  </div>
);

}
export default Item;