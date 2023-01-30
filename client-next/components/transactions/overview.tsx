import Blockies from "react-blockies";

interface IProps {
  receiver: string;
  message: string;
  amount: string;
  timestamp: string;
  isCredit?: boolean;
}
export const TransactionOverview = ({ receiver, message, amount, timestamp, isCredit }: IProps) => {
  return (
    <div className=" flex justify-between">
      <div className=" inline-flex space-x-3 items-center">
        <Blockies seed={receiver} size={10} scale={3} className=" rounded-full" />
        <div className=" inline-flex flex-col">
          <div className="font-medium">{receiver}</div>
          <div className=" font-thin text-xs text-gray-500">{message}</div>
        </div>
      </div>
      <div className=" inline-flex flex-col items-end">
        <div className={`font-medium ${isCredit ? "text-green-500" : "text-red-500"}`}>{amount}</div>
        <div className=" font-thin text-xs text-gray-500">{timestamp}</div>
      </div>
    </div>
  );
};
