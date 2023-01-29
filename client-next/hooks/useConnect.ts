import { utils } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMoralis } from "react-moralis";
import contractAddresses from "../contract/addresses.json";

export const useConnect = () => {
  const [walletBalance, setWalletBalance] = useState(utils.parseEther("0"));
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    chainId: chainIdHex,
    isWeb3EnableLoading,
    web3,
  } = useMoralis();
  const chainId = useMemo(() => {
    return chainIdHex ? parseInt(chainIdHex) : undefined;
  }, [chainIdHex]);
  const contractAddress = useMemo(() => {
    return chainId && chainId in contractAddresses
      ? (contractAddresses as Record<string, string[]>)[chainId][0]
      : undefined;
  }, [chainId]);

  const getBalance = useCallback(async () => {
    if (!account || !web3) return;
    const result = await web3?.getBalance(account);
    setWalletBalance(result);
  }, [account, isWeb3Enabled, web3]);

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
      if (localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [enableWeb3, isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (!account) {
        handleDisconnect();
      }
    });
  }, [Moralis, deactivateWeb3, getBalance]);

  useEffect(() => {
    if (account && isWeb3Enabled) getBalance();
  }, [account, isWeb3Enabled]);

  const handleConnect = useCallback(async () => {
    await enableWeb3();
    localStorage.setItem("connected", "injected");
  }, []);

  const handleDisconnect = useCallback(async () => {
    localStorage.removeItem("connected");
    await deactivateWeb3();
    //localStorage.setItem("connected", "injected");
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  return {
    account,
    getBalance,
    contractAddress,
    handleConnect,
    handleDisconnect,
    isWeb3Enabled,
    isWeb3EnableLoading,
    walletBalance,
  };
};
