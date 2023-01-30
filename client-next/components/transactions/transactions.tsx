import { useSendEthContext } from "@/hooks/useContext";
import { utils } from "ethers";
import { TransactionOverview } from "./overview";

export const Transactions = () => {
  const { account, loadingTrxns, transactions } = useSendEthContext();
  if (!account) return null;
  return (
    <div className="w-full space-y-4">
      {/** Header */}
      <div className="flex items-center justify-between">
        <div className=" font-bold text-lg">Recent Transactions</div>
        <div className=" text-xs text-purple-500">See all transactions</div>
      </div>
      {loadingTrxns ? (
        <div className="flex items-center justify-center h-full space-x-4">
          <div className=" w-2 h-2 animate-ping bg-red-500"></div>
          <div className=" w-2 h-2 animate-ping bg-red-500"></div>
          <div className=" w-2 h-2 animate-ping bg-red-500"></div>
        </div>
      ) : (
        <div className=" flex flex-col space-y-3">
          {transactions
            ? transactions.map((trx, index) => (
                <TransactionOverview
                  key={index}
                  amount={`${utils.formatEther(trx.amount)} ETH`}
                  message={trx.message}
                  receiver={trx.receiver}
                  timestamp={new Date(trx.datetime.toNumber() * 1000).toLocaleString()}
                  isCredit={account.toUpperCase() === trx.receiver.toUpperCase()}
                />
              ))
            : null}
        </div>
      )}
    </div>
  );
};
