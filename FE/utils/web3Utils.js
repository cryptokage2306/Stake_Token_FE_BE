// @ts-ignore
import WalletConnect from "@walletconnect/web3-provider";
// @ts-ignore
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
// @ts-ignore
import Torus from "@toruslabs/torus-embed";
import supportedChains from "./supportedChains";
import { ethers } from "ethers";

export const getProviderOptions = () => {
  const infuraId = process.env.NEXT_PUBLIC_INFURA_ID;
  const providerOptions = {
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId,
      },
    },
    torus: {
      package: Torus,
    },
    binancechainwallet: {
      package: true,
    },
    opera: {
      package: true,
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: "Web3Modal Example App",
        infuraId,
      },
    },
  };
  return providerOptions;
};

export function getChainData(chainId) {
  const chainData = supportedChains.filter(
    (chain) => chain.chain_id === chainId
  )[0];

  if (!chainData) {
    throw new Error("ChainId missing or not supported");
  }

  const API_KEY = process.env.REACT_APP_INFURA_ID;

  if (
    chainData.rpc_url.includes("infura.io") &&
    chainData.rpc_url.includes("%API_KEY%") &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace("%API_KEY%", API_KEY);

    return {
      ...chainData,
      rpc_url: rpcUrl,
    };
  }

  return chainData;
}

export const getNetwork = (chainId = 1) => getChainData(chainId).network;

export function initWeb3(provider) {
  const etherprovider = new ethers.providers.Web3Provider(provider);

  return etherprovider;
}
