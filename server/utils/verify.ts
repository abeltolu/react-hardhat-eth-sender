import { run } from "hardhat";

export const verifyContract = async (contractAddress: string, args: Array<unknown>) => {
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log("error === ", error);
    }
  }
};
