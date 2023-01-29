import { useConnect } from "./useConnect";
import { useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";
import SendEthAbi from "../contract/abi.json";
import { Abi as SendEthAbiInterface } from "@/contract/types";

interface ISendProps {
  params: { amount: string; _receiver: string; _message: string };
  onSuccess: (trx: ethers.ContractTransaction | undefined) => void;
  onError: (error: any) => void;
}

export const useSendEthContract = () => {
  const { isWeb3Enabled, account, web3 } = useMoralis();
  const { contractAddress } = useConnect();
  const sendEthContract = useMemo(() => {
    if (!account || !isWeb3Enabled || !web3 || !contractAddress) return undefined;

    const signer = web3.getSigner();
    const contract = new ethers.Contract(contractAddress, SendEthAbi, signer as unknown as ethers.Signer);
    return contract as SendEthAbiInterface;
  }, [account, isWeb3Enabled, web3, contractAddress]);

  const sendETH = useCallback(
    async ({ params, onSuccess, onError }: ISendProps) => {
      try {
        const trx = await sendEthContract?.transferETH(params._receiver, params._message, {
          value: ethers.utils.parseEther(params.amount.toString()),
        });
        console.log(`Loading - ${trx?.hash}`);
        await trx?.wait(1);
        onSuccess(trx);
      } catch (error) {
        onError(error);
      }
    },
    [sendEthContract]
  );
  return { sendETH };
};
