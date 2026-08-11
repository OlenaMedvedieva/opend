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
  const [showPriceInput, setShowPriceInput] = React.useState(false);
  const [blur, setBlur] = React.useState({});
  const [listed, setListed] = React.useState(false);
  const [isListed, setIsListed] = React.useState(false);
  const [price, setPrice] = React.useState("");
  const [shouldDisplay, setDisplay] = React.useState(true);
  const [loaderHidden, setLoaderHidden] = React.useState(true);

  const NFTActor = React.useRef(null);

  async function loadNFT() {
    try {
      const id = props.id;
      const nftPrincipal =
        typeof id === "string" ? Principal.fromText(id) : id;

      console.log("ITEM ID:", nftPrincipal.toText());
      console.log("ITEM ROLE:", props.role);

      const agent = new HttpAgent({
        host: "http://127.0.0.1:8000",
      });

      await agent.fetchRootKey();

      NFTActor.current = Actor.createActor(idlFactory, {
        agent,
        canisterId: nftPrincipal,
      });

      const nftName = await NFTActor.current.getName();
      const nftOwner = await NFTActor.current.getOwner();
      const imageData = await NFTActor.current.getAsset();

      console.log("NFT OWNER:", nftOwner.toText());

      const imageContent = new Uint8Array(imageData);
      const imageUrl = URL.createObjectURL(
        new Blob([imageContent], { type: "image/png" })
      );

      setName(nftName);
      setOwner(nftOwner.toText());
      setImage(imageUrl);

      const nftIsListed = await opend.isListed(nftPrincipal);

      console.log("IS LISTED:", nftIsListed);

      setIsListed(nftIsListed);

      if (props.role === "collection") {
        console.log("COLLECTION ROLE");

        if (nftIsListed) {
          console.log("NFT IS LISTED");

          setListed(true);
          setOwner("OpenD");
          setBlur({ filter: "blur(4px)" });
          setShowPriceInput(false);
        } else {
          console.log("NFT IS NOT LISTED");

          setListed(false);
          setBlur({});
          setShowPriceInput(false);
        }
      }

      if (props.role === "discover") {
        console.log("DISCOVER ROLE");

        if (nftIsListed) {
          const listedPrice =
            await opend.getListedNFTPrice(nftPrincipal);

          console.log(
            "NFT PRICE FROM CANISTER:",
            listedPrice.toString()
          );

          setPrice(listedPrice.toString());
          setShowPriceInput(false);
        } else {
          console.log("NFT NOT LISTED");

          setPrice("");
          setShowPriceInput(false);
        }
      }
    } catch (error) {
      console.error("NFT loading error:", error);
    }
  }

  React.useEffect(() => {
    if (props.id) {
      loadNFT();
    }
  }, [props.id, props.role]);

  function handleSell() {
    console.log("========== SELL CLICKED ==========");
    console.log("NFT ID:", props.id);
    console.log("ROLE:", props.role);

    setShowPriceInput(true);
    
  }

  async function sellItem() {
    console.log("========== CONFIRM SELL ==========");
    console.log("PRICE:", price);

    if (price === "" || Number(price) <= 0) {
      console.log("Please enter a valid price");
      return;
    }

    try {
      setBlur({ filter: "blur(4px)" });

      const nftPrincipal =
        typeof props.id === "string"
          ? Principal.fromText(props.id)
          : props.id;

      console.log("NFT ID:", nftPrincipal.toText());
      console.log("PRICE:", Number(price));

      const listingResult = await opend.listItem(
        nftPrincipal,
        Number(price)
      );

      console.log("LISTING RESULT:", listingResult);

      if (
        listingResult === "Success" ||
        listingResult === "Succes"
      ) {
        console.log("LISTING SUCCESS");

        const openDId = await opend.getOpenDCanisterID();

        console.log(
          "OPEND ID:",
          openDId.toText ? openDId.toText() : openDId
        );

        const transferResult =
          await NFTActor.current.transferOwnership(openDId);

        console.log("TRANSFER RESULT:", transferResult);

        if (
          transferResult === "Success" ||
          transferResult === "Succes"
        ) {
          console.log("TRANSFER SUCCESS");

          setOwner("OpenD");
          setListed(true);
          setIsListed(true);
          setShowPriceInput(false);
          setBlur({ filter: "blur(4px)" });
          window.location.reload();
        } else {
          console.log("TRANSFER FAILED:", transferResult);
          setBlur({});
        }
      } else {
        console.log("LISTING FAILED:", listingResult);
        setBlur({});
      }
    } catch (error) {
      console.error("SELLING NFT ERROR:", error);
      setBlur({});
    }
  }

 async function handleBuy() {
  try {
    console.log("========== BUY CLICKED ==========");

    setLoaderHidden(false);

    const nftPrincipal =
      typeof props.id === "string"
        ? Principal.fromText(props.id)
        : props.id;

    console.log(
      "NFT ID:",
      nftPrincipal.toText()
    );

    const listed =
      await opend.isListed(nftPrincipal);

    console.log(
      "IS LISTED:",
      listed
    );

    if (!listed) {
      console.error("NFT IS NOT LISTED");
      setLoaderHidden(true);
      return;
    }

    const itemPrice =
      await opend.getListedNFTPrice(nftPrincipal);

    console.log(
      "ITEM PRICE:",
      itemPrice.toString(),
      "DANG"
    );

    
    const purchaseResult =
      await opend.completePurchase(
        nftPrincipal
      );

const caller = await opend.whoAmI();

console.log(
  "BROWSER OPEND CALLER:",
  caller.toText()
);
    console.log(
      "COMPLETE PURCHASE RESULT:",
      purchaseResult
    );

    setLoaderHidden(true);

    if (
      purchaseResult === "Success" ||
      purchaseResult === "Succes"
    ) {
      console.log(
        "========== PURCHASE SUCCESS =========="
      );

      setIsListed(false);
      setListed(false);
      setOwner("You");
      setPrice("");
      setBlur({});
      setDisplay(true);

    } else {
      console.error(
        "PURCHASE FAILED:",
        purchaseResult
      );
    }

  } catch (error) {

    setLoaderHidden(true);

    console.error(
      "BUY ERROR:",
      error
    );
  }
}
  return (
    <div
      style={{
        display: shouldDisplay ? "inline" : "none",
      }}
      className="disGrid-item"
    >
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

          {props.role === "discover" && isListed && (
            <div className="disButtonBase-root disChip-root makeStyles-price-23 disChip-outlined">
              <span className="disChip-label">
                {price} DANG
              </span>
            </div>
          )}

          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}

            {listed && (
              <span>
                {" "}
                Listed
              </span>
            )}
          </h2>

          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>

          {props.role === "collection" &&
            !isListed &&
            !showPriceInput && (
              <Button
                handleClick={handleSell}
                text="Sell"
              />
            )}

          {props.role === "collection" &&
            !isListed &&
            showPriceInput && (
              <input
                placeholder="Price in DANG"
                type="number"
                className="price-input"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
              />
            )}

          {props.role === "collection" &&
            !isListed &&
            showPriceInput && (
              <Button
                handleClick={sellItem}
                text="Confirm"
              />
            )}

          {props.role === "discover" &&
            isListed && (
              <Button
                handleClick={handleBuy}
                text="Buy"
              />
            )}

        </div>
      </div>
    </div>
  );
}

export default Item;