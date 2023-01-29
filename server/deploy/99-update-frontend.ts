//THIS FILE IS OPTIONAL AND WAS ONLY INCLUDED TO GENERATE TYPES FOR THE NEXTJS FRONTEND CODE

import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import fs from "fs";
import { ethers, getChainId, deployments } from "hardhat";
import { frontEndAbiFile, frontEndContractsFile } from "../hardhat.helper";

async function updateAbi(deployer: string) {
  const [owner] = await ethers.getSigners();
  const contract = await ethers.getContractAt("SendEth", deployer, owner);
  fs.writeFileSync(frontEndAbiFile, contract.interface.format(ethers.utils.FormatTypes.json) as string);
}

async function updateContractAddresses(deployer: string) {
  const [owner] = await ethers.getSigners();
  const contract = await ethers.getContractAt("SendEth", deployer, owner);
  const chainId = await getChainId();
  const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"));
  if (chainId.toString() in contractAddresses) {
    if (!contractAddresses[chainId.toString()].includes(contract.address)) {
      contractAddresses[chainId.toString()].push(contract.address);
    }
  } else {
    contractAddresses[chainId.toString()] = [contract.address];
  }
  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  if (process.env.UPDATE_FRONT_END) {
    console.log("Writing to front end...");
    await updateContractAddresses(deployer);
    await updateAbi(deployer);
    console.log("Front end written!");
  }
};

func["tags"] = ["All", "FrontEnd"];
export default func;
