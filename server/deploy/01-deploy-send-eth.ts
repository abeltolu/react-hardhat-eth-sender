import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains } from "../hardhat.helper";
import { verifyContract } from "../utils/verify";
import { network } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  log("ChainID is === ", chainId);
  log("Deploying SendEth...");

  const sendEthContract = await deploy("SendEth", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
  });
  log("Deployed SendEth...");
  log("Main Contract address is === ", sendEthContract.address);

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verifyContract(sendEthContract.address, []);
    log("Verified on Etherscan!");
  }
};
func["tags"] = ["All", "SendEth", "Main"];
export default func;
