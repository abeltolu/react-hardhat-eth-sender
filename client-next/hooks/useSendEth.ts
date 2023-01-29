import SendEthAbi from "../contract/abi.json";
import { useWeb3Contract } from "react-moralis";
import { useConnect } from "./useConnect";

export const useSendEthContract = () => {
  const { contractAddress } = useConnect();
  const { runContractFunction: getMyTransactions } = useWeb3Contract({
    abi: SendEthAbi,
    contractAddress,
    functionName: "myTransactions",
    params: {},
  });
  return { getMyTransactions };
};
