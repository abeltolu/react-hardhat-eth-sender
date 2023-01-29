import { useEffect, useState } from "react";
import { useEthers, useEtherBalance, shortenAddress } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import * as ethers from "ethers";
import { SendEthButton, DarkButton } from "../buttons";
import { SendEthForm, IFormValues } from "./sendEth";
import { useSendEthContract } from "../../hooks/useSendEth";
export const Balance = () => {
  const [showForm, setShowForm] = useState(false);
  const { account, activateBrowserWallet } = useEthers();
  const { send, state, events } = useSendEthContract();
  const balance = useEtherBalance(account);
  const etherBalance = balance ? ethers.utils.formatUnits(balance) : 0;
  const toggleShowForm = () => {
    setShowForm((prev) => !prev);
  };

  async function loader() {
    await send()
      .then((result) => console.log({ result }))
      .catch((error) => console.error({ error }));
  }
  const handleFormSubmit = (values: IFormValues) => {
    //let's perform some validation
    try {
      const receiverAddress = shortenAddress(values.receiver);
      if (values.amount <= 0) throw new Error("Amount must be greater than 0");

      loader();
    } catch (error: any) {
      alert(error?.["message"]);
    }
  };
  useEffect(() => {
    console.log({ state, events });
  }, [state, events]);
  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-lg space-y-4">
      {!account ? (
        <div className="text-center">
          <DarkButton onClick={activateBrowserWallet}>Connect Wallet</DarkButton>
        </div>
      ) : (
        <>
          <div className="text-center">
            <div className=" text-sm font-light text-gray-300">Wallet Balance</div>
            <div className=" text-4xl text-white font-semibold">{(+etherBalance).toFixed(3)} ETH</div>
          </div>
          <div className="w-full max-w-xs mx-auto">
            <div
              className={`${
                !showForm ? "opacity-100" : "opacity-0 h-0"
              } transform transition-all duration-300 ease-linear text-center`}
            >
              <SendEthButton onClick={toggleShowForm} />
            </div>
            <div
              className={`${
                showForm ? "opacity-100" : "h-0 opacity-0"
              } transform transition-all duration-300 ease-linear`}
            >
              <SendEthForm onCancel={toggleShowForm} onSubmit={handleFormSubmit} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};