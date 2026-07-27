
import React from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";

function Item(props) {
  const [name, setName] = React.useState("");
  const [owner, setOwner] = React.useState("");
  const [image, setImage] = React.useState("");

  
async function loadNFT() {
  try {

    const id = props.id;

    const agent = new HttpAgent({
      host: "http://127.0.0.1:8000",
    });

    await agent.fetchRootKey();

    const NFTActor = Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    const nftName = await NFTActor.getName();
    const nftOwner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();

    console.log("NFT name:", nftName);
    console.log("NFT owner:", nftOwner.toText());
    console.log("Image bytes:", imageData.length);

    const imageContent = new Uint8Array(imageData);

    const imageUrl = URL.createObjectURL(
      new Blob([imageContent], {
        type: "image/png",
      })
    );

    setName(nftName);
    setOwner(nftOwner.toText());
    setImage(imageUrl);
  } catch (error) {
    console.error("NFT loading error:", error);
  }
}


  React.useEffect(() => {
    if (props.id) {
      loadNFT();
    }
  }, [props.id]);

  return (
    <div>
      <h1>{name}</h1>
      <p>{owner}</p>

      {image && (
        <img
          src={image}
          alt={name}
        />
      )}
    </div>
  );
}

export default Item;

