import { useState } from "react";
import { SendEthButton } from "../buttons";
import { SendEthForm } from "./sendEth";
export const Balance = () => {
  const [showForm, setShowForm] = useState(false);
  const toggleShowForm = () => {
    setShowForm((prev) => !prev);
  };
  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-lg space-y-4">
      <div className="text-center">
        <div className=" text-sm font-light text-gray-300">Wallet Balance</div>
        <div className=" text-4xl text-white font-semibold">0.2333 ETH</div>
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
          className={`${showForm ? "opacity-100" : "h-0 opacity-0"} transform transition-all duration-300 ease-linear`}
        >
          <SendEthForm onCancel={toggleShowForm} />
        </div>
      </div>
    </div>
  );
};
