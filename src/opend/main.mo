import NFT "../NFT/nft";
import Principal "mo:base/Principal";


actor OpenD {

    public func mint(name: Text, owner: Principal, content: [Nat8]) : async NFT.NFT {
        let newNFT = await NFT.NFT(name, owner, content);
        return newNFT;
    };

};
