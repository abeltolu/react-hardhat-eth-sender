import { useState } from "react";
import * as ethers from "ethers";
import { SendEthButton, DarkButton } from "../buttons";
import { SendEthForm, IFormValues } from "./sendEth";
import { useSendEthContext } from "@/hooks/useContext";
export const Balance = () => {
  const [showForm, setShowForm] = useState(false);
  const { account, handleConnect, walletBalance, getBalance, sendETH, getMyTransactions } = useSendEthContext();
  const etherBalance = walletBalance ? ethers.utils.formatUnits(walletBalance) : 0;
  const toggleShowForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleFormSubmit = async (values: IFormValues) => {
    try {
      if (values.amount <= 0) throw new Error("Amount must be greater than 0");

      const trimmedReceiver = values.receiver.trim();
      await sendETH({
        params: {
          amount: values.amount.toString(),
          _message: values.message ?? "",
          _receiver: trimmedReceiver,
        },
        onSuccess: (trx) => {
          getBalance();
          getMyTransactions();
          alert(`Transaction successful with hash: ${trx?.hash}`);
        },
        onError: (error) => {
          console.error("Trx error === ", error);
          alert(error?.data?.message || error?.message);
        },
      });
    } catch (error: any) {
      alert(error?.["message"]);
    }
  };
  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-lg space-y-4">
      {!account ? (
        <div className="text-center">
          <DarkButton onClick={handleConnect}>Connect Wallet</DarkButton>
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
