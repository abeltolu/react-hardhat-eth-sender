import { utils } from "ethers";
import { useContractFunction, useEthers, Localhost } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import SendEthAbi from "../contract/abi.json";

export const useSendEthContract = () => {
  const wethInterface = new utils.Interface(JSON.stringify(SendEthAbi));
  const wethContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contract = new Contract(wethContractAddress, wethInterface);
  const { chainId } = useEthers();
  const { state, send, events } = useContractFunction(contract, "myTransactions");
  return { state, send, events };
};
