
import React from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import Button from "./Button";
import { opend } from "../../../declarations/opend";
import { Principal } from "@dfinity/principal";


function Item(props) {
  const [name, setName] = React.useState("");
  const [owner, setOwner] = React.useState("");
  const [image, setImage] = React.useState("");
  const [button, setButton] = React.useState(null);
  const [priceInput, setPriceInput] = React.useState(null);
  
   const NFTActor = React.useRef(null);
  

   console.log("Item received ID:", props.id);
   console.log("Item ID text:", props.id?.toText?.());

  async function loadNFT() {
    try {
      const id = props.id;

      const agent = new HttpAgent({
        host: "http://127.0.0.1:8000",
      });

      
    await agent.fetchRootKey();

console.log("IDL FACTORY:", idlFactory);

NFTActor.current = Actor.createActor(idlFactory, {
  agent,
  canisterId: id,
});

console.log("NFT Actor:", NFTActor.current);
console.log(
  "transferOwnership function:",
  NFTActor.current.transferOwnership
);

      const nftName = await NFTActor.current.getName();
      const nftOwner = await NFTActor.current.getOwner();
      const imageData = await NFTActor.current.getAsset();

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

      setButton(
        <Button
          handleClick={handleSell}
          text={"Sell"}
        />
      );
    } catch (error) {
      console.error("NFT loading error:", error);
    }
  }

  React.useEffect(() => {
    if (props.id) {
      loadNFT();
    }
  }, [props.id]);

  let price;

  function handleSell() {
    console.log("Sell clicked");

    setPriceInput(
      <input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        onChange={(e) => (price = e.target.value)}
      />
    );

    setButton(
      <Button
        handleClick={sellItem}
        text={"Confirm"}
      />
    );
  }

 async function sellItem() {
  console.log("set price = " + price);

  const nftPrincipal =
    typeof props.id === "string"
      ? Principal.fromText(props.id)
      : props.id;

  const listingResult = await opend.listItem(
    nftPrincipal,
    Number(price)
  );

  console.log("listing: " + listingResult);

  if (listingResult == "Success") {
    const openDId = await opend.getOpenDCanisterID();

    const transferResult = await NFTActor.current.transferOwnership(openDId);

    console.log("transfer: " + transferResult);
  }
}
  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        {image && (
          <img
            className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
            src={image}
            alt={name}
          />
        )}

        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
          </h2>

          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>

          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;

