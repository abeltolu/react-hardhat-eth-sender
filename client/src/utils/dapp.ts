import { Config, Goerli, Localhost } from "@usedapp/core";
import { getDefaultProvider } from "ethers";

const HardhatNodeChainId = 31337;
export const dappConfig: Config = {
  readOnlyChainId: Localhost.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: getDefaultProvider("goerli", {
      alchemy: "RNd2mT9NJVIEK2yHxJRwbdar8KuqTna9",
    }),
    [Localhost.chainId]: "http://127.0.0.1:7545",
    //[HardhatNodeChainId]: "http://127.0.0.1:8545", //hardhat node
  },
};
