import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains } from "../hardhat.helper";
import { verifyContract } from "../utils/verify";
import { network } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("Deploying SendEth...");

  const nftMarketplace = await deploy("SendEth", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
  });
  log("Deployed SendEth...");

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verifyContract(nftMarketplace.address, []);
    log("Verified on Etherscan!");
  }
};
func["tags"] = ["All", "SendEth", "Main"];
export default func;
