import { useConnect } from "./useConnect";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useMoralis } from "react-moralis";
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

export const useContract = () => {
  const { isWeb3Enabled, account, web3 } = useMoralis();
  const { contractAddress } = useConnect();
  const sendEthContract = useMemo(() => {
    if (!account || !isWeb3Enabled || !web3 || !contractAddress) return undefined;

    const signer = web3.getSigner();
    const contract = new ethers.Contract(contractAddress, SendEthAbi, signer as unknown as ethers.Signer);
    return contract as SendEthAbiInterface;
  }, [account, isWeb3Enabled, web3, contractAddress]);
  return { sendEthContract };
};

export const useSendEth = () => {
  const [loading, setLoading] = useState(false);
  const { sendEthContract } = useContract();

  const sendETH = useCallback(
    async ({ params, onSuccess, onError }: ISendProps) => {
      try {
        setLoading(true);
        const trx = await sendEthContract?.transferETH(params._receiver, params._message, {
          value: ethers.utils.parseEther(params.amount.toString()),
        });
        console.log(`Loading - ${trx?.hash}`);
        await trx?.wait(1);
        if (onSuccess) onSuccess(trx);
      } catch (error) {
        if (onError) onError(error);
      } finally {
        setLoading(false);
      }
    },
    [sendEthContract]
  );
  return { loading, sendETH };
};

export const useTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<ITransactionResult[]>([]);
  const { sendEthContract } = useContract();

  const getMyTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const trxs = await sendEthContract?.myTransactions();
      setTransactions(trxs as unknown as ITransactionResult[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [sendEthContract]);

  useEffect(() => {
    getMyTransactions();
  }, [getMyTransactions]);

  return { loading, transactions, getMyTransactions };
};
