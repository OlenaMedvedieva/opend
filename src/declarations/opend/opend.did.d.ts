import type { Principal } from '@dfinity/principal';
export interface NFT {
  'getAsset' : () => Promise<Array<number>>,
  'getName' : () => Promise<string>,
  'getOwner' : () => Promise<Principal>,
}
export interface _SERVICE {
  'mint' : (arg_0: string, arg_1: Principal, arg_2: Array<number>) => Promise<
      Principal
    >,
}
