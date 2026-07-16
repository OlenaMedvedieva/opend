export const idlFactory = ({ IDL }) => {
  const NFT = IDL.Service({
    'getAsset' : IDL.Func([], [IDL.Vec(IDL.Nat8)], ['query']),
    'getName' : IDL.Func([], [IDL.Text], ['query']),
    'getOwner' : IDL.Func([], [IDL.Principal], ['query']),
  });
  return IDL.Service({
    'mint' : IDL.Func([IDL.Text, IDL.Principal, IDL.Vec(IDL.Nat8)], [NFT], []),
  });
};
export const init = ({ IDL }) => { return []; };
