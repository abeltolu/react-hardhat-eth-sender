import { Loader } from "@/components/loader";
import { Header } from "@/components/header/header";
import { Balance } from "@/components/balance/balance";
import { Transactions } from "@/components/transactions/transactions";
import { useSendEthContext } from "@/hooks/useContext";
import { useMoralis } from "react-moralis";

export default function Home() {
  const { isWeb3Enabled, isWeb3EnableLoading: isLoading } = useMoralis();
  const { contractAddress } = useSendEthContext();
  const unacceptedChain = isWeb3Enabled && !contractAddress;
  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <div className="py-4 md:py-6 px-4 md:px-0 w-full max-w-[800px] mx-auto space-y-4">
          {
            <>
              {unacceptedChain ? (
                <p className="text-center">Please use either Mainnet or Goerli testnet.</p>
              ) : (
                <>
                  {/** Header component that has both the welcome and connect wallet button */}
                  <Header />
                  {/** Section that shows the wallet balance and the send ETH button */}
                  <Balance />
                  {/** Section that shows Recent transactions */}
                  <Transactions />
                  {/** Footer that shows Made with love by @abeltolu */}
                </>
              )}
            </>
          }
        </div>
      )}
    </>
  );
}
