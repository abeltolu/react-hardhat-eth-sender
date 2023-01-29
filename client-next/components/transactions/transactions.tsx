import { useEthers } from "@usedapp/core";
import { TransactionOverview } from "./overview";

export const Transactions = () => {
  const { account } = useEthers();
  if (!account) return null;
  return (
    <div className="w-full space-y-4">
      {/** Header */}
      <div className="flex items-center justify-between">
        <div className=" font-bold text-lg">Recent Transactions</div>
        <div className=" text-xs text-purple-500">See all transactions</div>
      </div>
      {/** Transactions list */}
      <div className=" flex flex-col space-y-3">
        {Array(30)
          .fill("*")
          .map((_, index) => (
            <TransactionOverview
              key={index}
              amount="$2500"
              message="Transfer to bank"
              receiver="Bank of asia"
              timestamp="12/12/2023 17:12PM"
            />
          ))}
      </div>
    </div>
  );
};
