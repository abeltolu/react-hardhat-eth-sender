import { useEthers, shortenIfAddress } from "@usedapp/core";
import Blockies from "react-blockies";
import Logo from "../../assets/metamask.svg";

export const Header = () => {
  const { activateBrowserWallet, deactivate, account } = useEthers();
  const handleConnect = () => {
    activateBrowserWallet();
  };
  const handleDisconnect = () => {
    deactivate();
    window.location.reload();
  };
  return (
    <header className="flex justify-between items-center">
      <div className="">
        <div className=" text-2xl font-semibold">Hello again</div>
        <div>Welcome Back 👋</div>
      </div>
      <div>
        <button
          type="button"
          onClick={account ? handleDisconnect : handleConnect}
          className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
        >
          {account ? (
            <>
              <Blockies seed={account} size={8} scale={2} className="rounded-full mr-1" /> {shortenIfAddress(account)}
            </>
          ) : (
            <>
              <Logo className="w-4 h-4 mr-1" /> Connect Wallet
            </>
          )}
        </button>
      </div>
    </header>
  );
};
