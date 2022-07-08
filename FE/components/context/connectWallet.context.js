import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getProviderOptions,
  initWeb3,
  getNetwork,
} from "../../utils/web3Utils";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { STAKING_TOKEN } from "../../constant";
const ConnectWalletContext = createContext();

export { ConnectWalletContext };
export const ConnectWalletProvider = ({ children }) => {
  const web3Modal = useRef();
  const [state, setState] = useState({
    etherprovider: null,
    provider: null,
    connected: false,
    address: null,
    chainId: null,
  });
  useEffect(() => {
    if (web3Modal.current) return;
    web3Modal.current = new Web3Modal({
      network: getNetwork(),
      cacheProvider: true,
      providerOptions: getProviderOptions(),
    });
  }, [web3Modal]);

  const connectWallet = useCallback(async () => {
    try {
      const provider = await web3Modal.current.connect();

      await subscribeProvider(provider);

      await provider.enable();
      const etherprovider = initWeb3(provider);

      const accounts = await etherprovider.listAccounts();

      const address = accounts[0];

      const { chainId } = await etherprovider.getNetwork();

      const signer = await etherprovider.getSigner();
      await setState({
        etherprovider,
        provider,
        connected: true,
        address,
        chainId,
        signer,
      });
    } catch (err) {
      console.error(err);
    }
  }, [state, web3Modal]);

  const subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => resetApp());
    provider.on("accountsChanged", async (accounts) => {
      setState((state) => ({ ...state, address: accounts[0] }));
    });
    provider.on("chainChanged", async (chainId) => {
      setState((state) => ({ ...state, chainId }));
    });
  };

  const resetApp = async () => {
    // const { etherprovider } = state;
    // if (etherprovider && etherprovider.close) {
    //   await etherprovider.currentProvider.close();
    // }
    await web3Modal.current.clearCachedProvider();
    setState({
      etherprovider: null,
      provider: null,
      connected: false,
      address: null,
      chainId: null,
    });
  };

  const value = useMemo(
    () => ({
      ...state,
      connectWallet,
    }),
    [web3Modal, state]
  );

  return (
    <ConnectWalletContext.Provider value={value}>
      {children}
    </ConnectWalletContext.Provider>
  );
};

export const useStakingContract = () => {
  const { signer } = useContext(ConnectWalletContext);
  return useMemo(() => {
    if (!signer) return null;
    return new ethers.Contract(
      "0x2fa337efDE18cDA62af20eD9ECBD4181CD41c1e3",
      STAKING_TOKEN.abi,
      signer
    );
  }, [signer]);
};
