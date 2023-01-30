import { BigNumber, ethers, utils } from "ethers";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useMoralis } from "react-moralis";
import contractAddresses from "../contract/addresses.json";
import SendEthAbi from "../contract/abi.json";
import { Abi as SendEthAbiInterface } from "@/contract/types/Abi";

interface ISendProps {
  params: { amount: string; _receiver: string; _message: string };
  onSuccess?: (trx: ethers.ContractTransaction | undefined) => void;
  onError?: (error: any) => void;
}

interface ITransactionResult {
  sender: string;
  receiver: string;
  amount: BigNumber;
  message: string;
  datetime: BigNumber;
}

interface IProps {
  account: string | null;
  contractAddress: string | undefined;
  walletBalance: ethers.BigNumber;
  sendEthContract: SendEthAbiInterface | undefined;
  sendingEth: boolean;
  loadingTrxns: boolean;
  transactions: ITransactionResult[];
  sendETH: (data: ISendProps) => Promise<void>;
  getBalance: () => Promise<void>;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  getMyTransactions: () => Promise<void>;
}

const Noop = () => Promise.resolve();
export const SendEthContext = createContext<IProps>({
  account: null,
  contractAddress: undefined,
  walletBalance: utils.parseEther("0"),
  sendEthContract: undefined,
  sendingEth: false,
  loadingTrxns: false,
  transactions: [],
  sendETH: Noop,
  getBalance: Noop,
  handleConnect: Noop,
  handleDisconnect: Noop,
  getMyTransactions: Noop,
});

export const SendEthProvider = ({ children }: { children: JSX.Element }) => {
  //state
  const [walletBalance, setWalletBalance] = useState(utils.parseEther("0"));
  const [sendingEth, setSendingEth] = useState(false);
  const [loadingTrxns, setLoadingTrnxs] = useState(false);
  const [transactions, setTransactions] = useState<ITransactionResult[]>([]);

  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, chainId: chainIdHex, web3 } = useMoralis();

  const chainId = useMemo(() => {
    return chainIdHex ? parseInt(chainIdHex) : undefined;
  }, [chainIdHex]);
  const contractAddress = useMemo(() => {
    return chainId && chainId in contractAddresses
      ? (contractAddresses as Record<string, string[]>)[chainId][0]
      : undefined;
  }, [chainId]);

  const sendEthContract = useMemo(() => {
    if (!account || !isWeb3Enabled || !web3 || !contractAddress) return undefined;

    const signer = web3.getSigner();
    const contract = new ethers.Contract(contractAddress, SendEthAbi, signer as unknown as ethers.Signer);
    return contract as SendEthAbiInterface;
  }, [account, isWeb3Enabled, web3, contractAddress]);

  const getBalance = useCallback(async () => {
    if (!account || !web3) return;
    const result = await web3?.getBalance(account);
    setWalletBalance(result);
  }, [account, isWeb3Enabled, web3]);

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

  const sendETH = useCallback(
    async ({ params, onSuccess, onError }: ISendProps) => {
      if (!sendEthContract) return;

      try {
        setSendingEth(true);
        const trx = await sendEthContract?.transferETH(params._receiver, params._message, {
          value: ethers.utils.parseEther(params.amount.toString()),
        });
        console.log(`Loading - ${trx?.hash}`);
        await trx?.wait(1);
        if (onSuccess) onSuccess(trx);
      } catch (error) {
        if (onError) onError(error);
      } finally {
        setSendingEth(false);
      }
    },
    [sendEthContract]
  );

  const getMyTransactions = useCallback(async () => {
    if (!sendEthContract) return;

    try {
      setLoadingTrnxs(true);
      const trxs = await sendEthContract?.myTransactions();
      setTransactions(trxs as unknown as ITransactionResult[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTrnxs(false);
    }
  }, [sendEthContract]);

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

  useEffect(() => {
    getMyTransactions();
  }, [getMyTransactions]);

  return (
    <SendEthContext.Provider
      value={{
        account,
        getBalance,
        contractAddress,
        handleConnect,
        handleDisconnect,
        walletBalance,
        sendEthContract,
        sendingEth,
        sendETH,
        loadingTrxns,
        transactions,
        getMyTransactions,
      }}
    >
      {children}
    </SendEthContext.Provider>
  );
};
