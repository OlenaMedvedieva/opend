# OpenD - Decentralized NFT Marketplace

OpenD is a decentralized NFT marketplace built on the Internet Computer using Motoko and React.

The project allows users to:

- Mint NFTs
- View owned NFTs
- List NFTs for sale
- Browse listed NFTs
- Purchase NFTs
- Transfer NFT ownership
- Pay using the DANG token

---

## Features

### NFT Minting

Users can create NFTs by uploading an image and providing a name.

### NFT Ownership

Each NFT has an owner stored inside its own NFT canister.

Functions:

- getOwner()
- transferOwnership()

### Marketplace

OpenD stores marketplace listings:

- NFT owner
- NFT price
- Listed status

Functions:

- listItem()
- getListedNFTs()
- isListed()
- getListedNFTPrice()

### Purchase System

Users can purchase NFTs using DANG tokens.

Purchase flow:

1. Buyer selects NFT
2. DANG tokens transferred
3. NFT ownership transferred
4. Listing removed
5. Ownership maps updated

Function:

- completePurchase()

---

## Technology Stack

### Frontend

- React
- JavaScript
- HTML
- CSS

### Backend

- Motoko
- Internet Computer
- DFX

### Canisters

- OpenD Marketplace
- NFT Canister
- DANG Token Canister
- Assets Canister

---

## Project Structure

```text
src/
├── NFT/
│   └── nft.mo
│
├── opend/
│   └── main.mo
│
├── opend_assets/
│   ├── assets/
│   └── src/
│       ├── components/
│       │   ├── App.jsx
│       │   ├── Gallery.jsx
│       │   ├── Header.jsx
│       │   ├── Item.jsx
│       │   ├── Minter.jsx
│       │   ├── Button.jsx
│       │   ├── PriceLabel.jsx
│       │   └── Footer.jsx
│       └── index.jsx
```

---

## Main Motoko Functions

### OpenD

- mint()
- getOwnedNFTs()
- getListedNFTs()
- listItem()
- getOpenDCanisterID()
- isListed()
- getOriginalOwner()
- getListedNFTPrice()
- completePurchase()
- whoAmI()

### NFT

- getName()
- getOwner()
- getAsset()
- transferOwnership()
- getCanisterID()

---

## Local Development

Start local replica:

```bash
dfx start --clean
```

Install dependencies:

```bash
npm install
```

Deploy canisters:

```bash
dfx deploy
```

Run frontend:

```bash
npm start
```

Open:

```text
http://localhost:8080
```

---

## Useful Commands

Generate declarations:

```bash
dfx generate
```

Get canister id:

```bash
dfx canister id opend
```

Check status:

```bash
dfx canister status opend
```

---

## Token Integration


OpenD integrates the DANG token canister for NFT marketplace payments.

The token interface currently includes:

- balanceOf()
- getSymbol()
- payOut()
- transfer()
---

## Built With

- Internet Computer
- Motoko
- React
- JavaScript
- DFX
- Git
- GitHub