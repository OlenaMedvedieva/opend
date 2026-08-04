
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

  const [showPriceInput, setShowPriceInput] =
    React.useState(false);

  const [blur, setBlur] = React.useState({});

  const [listed, setListed] =
    React.useState(false);

  const [isListed, setIsListed] =
    React.useState(false);

  const [price, setPrice] =
    React.useState("");

  const NFTActor =
    React.useRef(null);


  // =========================
  // LOAD NFT
  // =========================

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


      // =========================
      // CREATE NFT ACTOR
      // =========================

      const agent = new HttpAgent({
        host: "http://127.0.0.1:8000",
      });

      await agent.fetchRootKey();

      NFTActor.current =
        Actor.createActor(
          idlFactory,
          {
            agent,
            canisterId:
              nftPrincipal,
          }
        );


      // =========================
      // GET NFT DATA
      // =========================

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


      // =========================
      // IMAGE
      // =========================

      const imageContent =
        new Uint8Array(
          imageData
        );

      const imageUrl =
        URL.createObjectURL(
          new Blob(
            [imageContent],
            {
              type:
                "image/png",
            }
          )
        );


      setName(nftName);

      setOwner(
        nftOwner.toText()
      );

      setImage(imageUrl);


      // =========================
      // CHECK LISTED STATUS
      // =========================

      const nftIsListed =
        await opend.isListed(
          nftPrincipal
        );

      console.log(
        "IS LISTED:",
        nftIsListed
      );


      setIsListed(
        nftIsListed
      );


      // =========================
      // COLLECTION
      // =========================

      if (
        props.role ===
        "collection"
      ) {

        console.log(
          "COLLECTION ROLE"
        );


        if (
          nftIsListed
        ) {

          // NFT already listed

          console.log(
            "NFT IS LISTED"
          );

          setListed(true);

          setOwner(
            "OpenD"
          );

          setBlur({
            filter:
              "blur(4px)",
          });

          // No price input
          setShowPriceInput(
            false
          );

        } else {

          // NFT is available
          // to sell

          console.log(
            "NFT IS NOT LISTED"
          );

          setListed(false);

          setBlur({});

          setShowPriceInput(
            false
          );
        }
      }


      // =========================
      // DISCOVER
      // =========================

      if (
        props.role ===
        "discover"
      ) {

        console.log(
          "DISCOVER ROLE"
        );


        if (
          nftIsListed
        ) {

          const listedPrice =
            await opend.getListedNFTPrice(
              nftPrincipal
            );


          console.log(
            "NFT PRICE FROM CANISTER:",
            listedPrice.toString()
          );


          setPrice(
            listedPrice.toString()
          );

          setShowPriceInput(
            false
          );

        } else {

          console.log(
            "NFT NOT LISTED"
          );

          setPrice("");

          setShowPriceInput(
            false
          );
        }
      }

    } catch (error) {

      console.error(
        "NFT loading error:",
        error
      );

    }
  }


  // =========================
  // USE EFFECT
  // =========================

  React.useEffect(() => {

    if (
      props.id
    ) {

      loadNFT();

    }

  }, [
    props.id,
    props.role
  ]);


  // =========================
  // SELL BUTTON
  // =========================

  function handleSell() {

    console.log(
      "========== SELL CLICKED =========="
    );

    console.log(
      "NFT ID:",
      props.id
    );

    console.log(
      "ROLE:",
      props.role
    );


    // Open price input

    setShowPriceInput(
      true
    );

  }


  // =========================
  // LIST NFT
  // =========================

  async function sellItem() {

    console.log(
      "========== CONFIRM SELL =========="
    );

    console.log(
      "PRICE:",
      price
    );


    // =========================
    // CHECK PRICE
    // =========================

    if (
      price === "" ||
      Number(price) <= 0
    ) {

      console.log(
        "Please enter a valid price"
      );

      return;

    }


    try {

      setBlur({
        filter:
          "blur(4px)",
      });


      const nftPrincipal =
        typeof props.id === "string"
          ? Principal.fromText(
              props.id
            )
          : props.id;


      console.log(
        "NFT ID:",
        nftPrincipal.toText()
      );

      console.log(
        "PRICE:",
        Number(price)
      );


      // =========================
      // LIST NFT
      // =========================

      const listingResult =
        await opend.listItem(
          nftPrincipal,
          Number(price)
        );


      console.log(
        "LISTING RESULT:",
        listingResult
      );


      if (
        listingResult ===
          "Success" ||
        listingResult ===
          "Succes"
      ) {

        console.log(
          "LISTING SUCCESS"
        );


        // =========================
        // GET OPEND ID
        // =========================

        const openDId =
          await opend.getOpenDCanisterID();


        console.log(
          "OPEND ID:",
          openDId.toText
            ? openDId.toText()
            : openDId
        );


        // =========================
        // TRANSFER NFT
        // =========================

        const transferResult =
          await NFTActor.current.transferOwnership(
            openDId
          );


        console.log(
          "TRANSFER RESULT:",
          transferResult
        );


        if (
          transferResult ===
            "Success" ||
          transferResult ===
            "Succes"
        ) {

          console.log(
            "TRANSFER SUCCESS"
          );


          // NFT now belongs
          // to OpenD

          setOwner(
            "OpenD"
          );

          setListed(
            true
          );

          setIsListed(
            true
          );


          // Hide price input

          setShowPriceInput(
            false
          );


          // Keep image blurred

          setBlur({
            filter:
              "blur(4px)",
          });


        } else {

          console.log(
            "TRANSFER FAILED:",
            transferResult
          );

          setBlur({});

        }

      } else {

        console.log(
          "LISTING FAILED:",
          listingResult
        );

        setBlur({});

      }

    } catch (error) {

      console.error(
        "SELLING NFT ERROR:",
        error
      );

      setBlur({});

    }
  }


  // =========================
  // BUY
  // =========================

  async function handleBuy() {

    console.log(
      "========== BUY CLICKED =========="
    );


    const nftId =
      typeof props.id === "string"
        ? props.id
        : props.id.toText();


    console.log(
      "NFT ID:",
      nftId
    );

    console.log(
      "NFT PRICE:",
      price
    );

  }


  // =========================
  // RENDER
  // =========================

  return (

    <div className="disGrid-item">

      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">


        {/* =========================
            NFT IMAGE
        ========================= */}

        {image && (

          <img
            className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
            src={image}
            style={blur}
            alt={name}
          />

        )}


        <div className="disCardContent-root">


          {/* =========================
              DISCOVER PRICE
          ========================= */}

          {props.role ===
            "discover" &&

            isListed && (

              <div className="disButtonBase-root disChip-root makeStyles-price-23 disChip-outlined">

                <span className="disChip-label">

                  {price}
                  {" "}
                  DANG

                </span>

              </div>

            )
          }


          {/* =========================
              NFT NAME
          ========================= */}

          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">

            {name}

            {listed && (

              <span>
                {" "}
                Listed
              </span>

            )}

          </h2>


          {/* =========================
              OWNER
          ========================= */}

          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">

            Owner:
            {" "}
            {owner}

          </p>


          {/* =========================
              MY NFTs
              SELL BUTTON
          ========================= */}

          {props.role ===
            "collection" &&

            !isListed &&

            !showPriceInput && (

              <Button
                handleClick={
                  handleSell
                }
                text="Sell"
              />

            )
          }


          {/* =========================
              PRICE INPUT
          ========================= */}

          {props.role ===
            "collection" &&

            !isListed &&

            showPriceInput && (

              <input
                placeholder=
                  "Price in DANG"
                type="number"
                className=
                  "price-input"
                value={
                  price
                }
                onChange={
                  (e) =>
                    setPrice(
                      e.target.value
                    )
                }
              />

            )
          }


          {/* =========================
              CONFIRM BUTTON
          ========================= */}

          {props.role ===
            "collection" &&

            !isListed &&

            showPriceInput && (

              <Button
                handleClick={
                  sellItem
                }
                text="Confirm"
              />

            )
          }


          {/* =========================
              DISCOVER BUY BUTTON
          ========================= */}

          {props.role ===
            "discover" &&

            isListed && (

              <Button
                handleClick={
                  handleBuy
                }
                text="Buy"
              />

            )
          }


        </div>

      </div>

    </div>

  );
}

export default Item;

