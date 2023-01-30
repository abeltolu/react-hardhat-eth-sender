import { useCallback, useState } from "react";
import { SendEthButton, DarkButton } from "../buttons";
import { SendEthForm } from "./sendEth";
import { useSendEthContext } from "@/hooks/useContext";
import toast from "react-hot-toast";

export interface IFormValues {
  receiver: string;
  amount: number;
  message: string;
}
const initialState: IFormValues = { receiver: "", amount: 0, message: "" };

export const Balance = () => {
  const [showForm, setShowForm] = useState(false);
  const { account, handleConnect, formattedBalance, getBalance, sendETH, getMyTransactions, sendingEth } =
    useSendEthContext();
  const [formValues, setFormValues] = useState<IFormValues>(initialState);
  const handleValueChange = (key: keyof IFormValues, value: string | number) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };
  const toggleShowForm = () => setShowForm((prev) => !prev);
  const resetForm = () => setFormValues(initialState);

  const handleFormSubmit = useCallback(async () => {
    try {
      if (formValues.amount <= 0) throw new Error("Amount must be greater than 0");

      const trimmedReceiver = formValues.receiver.trim();
      await sendETH({
        params: {
          amount: formValues.amount.toString(),
          _message: formValues.message ?? "",
          _receiver: trimmedReceiver,
        },
        onSuccess: (trx) => {
          getBalance(); //refetch balance
          getMyTransactions(); //refetch transactions list
          resetForm(); //reset send eth form
          toggleShowForm(); //close form
          toast.success(`Transaction successful with hash: ${trx?.hash}`);
        },
        onError: (error) => {
          toast.error(error?.data?.message || error?.message);
        },
      });
    } catch (error: any) {
      toast.error(error?.["message"]);
    }
  }, [formValues]);
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
            <div className=" text-4xl text-white font-semibold">{(+formattedBalance).toFixed(3)} ETH</div>
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
              <SendEthForm
                formValues={formValues}
                isDisabled={sendingEth}
                onValueChange={handleValueChange}
                onCancel={toggleShowForm}
                onSubmit={handleFormSubmit}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
