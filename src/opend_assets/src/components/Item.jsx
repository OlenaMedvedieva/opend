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
const [snowpriceInput, setSnowPriceInput] = React.useState(false);
const [blur, setBlur] = React.useState({});
const [listed, setListed] = React.useState(false);
const [loaderHidden, setLoaderHidden] = React.useState(true);
const [price, setPrice] = React.useState("");
const NFTActor = React.useRef(null);

async function loadNFT() {
try {
const id = props.id;


  const agent = new HttpAgent({
    host: "http://127.0.0.1:8000",
  });

  await agent.fetchRootKey();

  NFTActor.current = Actor.createActor(idlFactory, {
    agent,
    canisterId: id,
  });

  const nftName = await NFTActor.current.getName();
  const nftOwner = await NFTActor.current.getOwner();
  const imageData = await NFTActor.current.getAsset();

  console.log("NFT OWNER:", nftOwner.toText());

  const imageContent = new Uint8Array(imageData);

  const imageUrl = URL.createObjectURL(
    new Blob([imageContent], {
      type: "image/png",
    })
  );

  setName(nftName);
  setOwner(nftOwner.toText());
  setImage(imageUrl);


const nftIsListed = await opend.isListed(
  Principal.fromText(props.id)
);
console.log("NFT ID:", props.id);
console.log("IS NFT LISTED:", nftIsListed);

if (nftIsListed) {
  setOwner("OpenD");
  setPrice("");
  setListed(true);
  setBlur({ filter: "blur(4px)" });
  setButton(null);
  setSnowPriceInput(false);
} else if (nftOwner.toText() !== "OpenD") {
  setListed(false);
  setButton(
    <Button
      handleClick={handleSell}
      text={"Sell"}
    />
  );
}
} catch (error) {
  console.error("NFT loading error:", error);
}


}

React.useEffect(() => {
if (props.id) {
loadNFT();
}
}, [props.id]);

function handleSell() {
console.log("Sell clicked");

setSnowPriceInput(true);

setButton(
  <Button
    handleClick={sellItem}
    text={"Confirm"}
  />
);


}

async function sellItem() {
try {
setBlur({ filter: "blur(4px)" });
setLoaderHidden(false);


  console.log("set price = " + price);

  const nftPrincipal =
    typeof props.id === "string"
      ? Principal.fromText(props.id)
      : props.id;

  const listingResult = await opend.listItem(
    nftPrincipal,
    Number(price)
  );

  console.log("listing result: ", listingResult);

  if (
    listingResult === "Succes" ||
    listingResult === "Success"
  ) {
    const openDId = await opend.getOpenDCanisterID();

    const transferResult =
      await NFTActor.current.transferOwnership(openDId);

    console.log("transfer: ", transferResult);

    if (
      transferResult === "Succes" ||
      transferResult === "Success"
    ) {
      console.log(
        "TRANSFER SUCCESS — HIDING BUTTON AND PRICE"
      );

      setLoaderHidden(true);
      setButton(null);
      setSnowPriceInput(false);
      setPrice("");
      setOwner("OpenD");
      setListed(true);
    } else {
      console.log("Transfer failed:", transferResult);
      setBlur({});
      setLoaderHidden(true);
    }
  } else {
    console.log("Listing failed:", listingResult);
    setBlur({});
    setLoaderHidden(true);
  }
} catch (error) {
  console.error("Selling NFT error:", error);
  setBlur({});
  setLoaderHidden(true);
}


}

return (
   <div className="disGrid-item"> <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        {image && ( <img
         className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
         src={image}
         style={blur}
         alt={name}
       />
)}


    <div className="disCardContent-root">
      <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
        {name} {listed &&<span>Listed</span>}
      </h2>

      <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
        Owner: {owner}
       
      </p>

      {snowpriceInput && (
        <input
          placeholder="Price in DANG"
          type="number"
          className="price-input"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      )}

      {button}
    </div>
  </div>
</div>

);
}

export default Item;
