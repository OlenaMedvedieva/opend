
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
  const [showPriceInput, setShowPriceInput] = React.useState(false);
  const [blur, setBlur] = React.useState({});
  const [listed, setListed] = React.useState(false);
  const [price, setPrice] = React.useState("");

  const NFTActor = React.useRef(null);
  const priceRef = React.useRef(null);
  async function loadNFT() {
    try {
      const id = props.id;

      const nftPrincipal =
        typeof id === "string"
          ? Principal.fromText(id)
          : id;

      console.log(
        "ITEM ID:",
        nftPrincipal.toText()
      );

      console.log(
        "ITEM ROLE:",
        props.role
      );

      const agent = new HttpAgent({
        host: "http://127.0.0.1:8000",
      });

      await agent.fetchRootKey();

      NFTActor.current = Actor.createActor(
        idlFactory,
        {
          agent,
          canisterId: nftPrincipal,
        }
      );

      const nftName =
        await NFTActor.current.getName();

      const nftOwner =
        await NFTActor.current.getOwner();

      const imageData =
        await NFTActor.current.getAsset();

      console.log(
        "NFT OWNER:",
        nftOwner.toText()
      );

      const imageContent =
        new Uint8Array(imageData);

      const imageUrl =
        URL.createObjectURL(
          new Blob(
            [imageContent],
            {
              type: "image/png",
            }
          )
        );

      setName(nftName);
      setOwner(nftOwner.toText());
      setImage(imageUrl);

      // =========================
      // MY NFTs
      // =========================

      if (props.role === "collection") {
         const nftIsListed =
          await opend.isListed(
            nftPrincipal
          );

       console.log("ROLE:", props.role);
      console.log("NFT OWNER:", nftOwner.toText());
      console.log("IS LISTED:", nftIsListed); 

        

        if (nftIsListed) {
          setOwner("OpenD");
          setListed(true);

          setBlur({
            filter: "blur(4px)",
          });

          setButton(null);
          setShowPriceInput(false);

        } else {
          setListed(false);
          setBlur({});

          setButton(
            <Button
              handleClick={handleSell}
              text="Sell"
            />
          );
        }
      }

      // =========================
      // DISCOVER
      // =========================

     else if (props.role === "discover") {
  console.log("DISCOVER ROLE - SHOW BUY");

  const listedPrice =
    await opend.getListedNFTPrice(nftPrincipal);

  console.log(
    "DISCOVER NFT ID:",
    nftPrincipal.toText()
  );

  console.log(
    "NFT PRICE FROM CANISTER:",
    listedPrice.toString()
  );

  setPrice(listedPrice.toString());

  setButton(
    <Button
      handleClick={handleBuy}
      text="Buy"
    />
  );
}

    } catch (error) {
      console.error(
        "NFT loading error:",
        error
      );
    }
  }

  React.useEffect(() => {
    if (props.id) {
      loadNFT();
    }
  }, [props.id]);

  // =========================
  // SELL
  // =========================

  function handleSell() {
    console.log(
      "Sell clicked"
    );

    setShowPriceInput(true);

    setButton(
      <Button
        handleClick={sellItem}
        text="Confirm"
      />
    );
  }

  async function sellItem() {
    try {
      setBlur({
        filter: "blur(4px)",
      });

      console.log(
        "set price =",
        price
      );

      const nftPrincipal =
        typeof props.id === "string"
          ? Principal.fromText(
              props.id
            )
          : props.id;

      const listingResult =
        await opend.listItem(
          nftPrincipal,
          Number(price)
        );

      console.log(
        "listing result:",
        listingResult
      );

      if (
        listingResult === "Success" ||
        listingResult === "Succes"
      ) {
        const openDId =
          await opend.getOpenDCanisterID();

        const transferResult =
          await NFTActor.current.transferOwnership(
            openDId
          );

        console.log(
          "transfer:",
          transferResult
        );

        if (
          transferResult === "Success" ||
          transferResult === "Succes"
        ) {
          setButton(null);

          setShowPriceInput(false);

          setOwner("OpenD");

          setListed(true);

          console.log(
            "TRANSFER SUCCESS"
          );

        } else {
          console.log(
            "Transfer failed:",
            transferResult
          );

          setBlur({});
        }

      } else {
        console.log(
          "Listing failed:",
          listingResult
        );

        setBlur({});
      }

    } catch (error) {
      console.error(
        "Selling NFT error:",
        error
      );

      setBlur({});
    }
  }

  // =========================
  // BUY
  // =========================
async function handleBuy() {
  console.log("Buy was triggered");

  console.log(
    "NFT ID:",
    props.id.toText
      ? props.id.toText()
      : props.id
  );

  console.log(
    "NFT PRICE:",
    priceRef.current
  );
}

  return (
    <div className="disGrid-item">

      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">

        {image && (
          <img
            className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
            src={image}
            style={blur}
            alt={name}
          />
        )}

        <div className="disCardContent-root">

          {/* PRICE */}

          {props.role === "discover" && (
            <div className="disButtonBase-root disChip-root makeStyles-price-23 disChip-outlined">
              <span className="disChip-label">
                {price} DANG
              </span>
            </div>
          )}

          {/* NAME */}

          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}

            {listed && (
              <span>
                {" "}
                Listed
              </span>
            )}
          </h2>

          {/* OWNER */}

          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>

          {/* SELL PRICE INPUT */}

          {showPriceInput && (
            <input
              placeholder="Price in DANG"
              type="number"
              className="price-input"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
            />
          )}

          {/* BUTTON */}

          {button}

        </div>
      </div>
    </div>
  );
}

export default Item;

