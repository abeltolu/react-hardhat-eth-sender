import { ReactComponent as Logo } from "../../assets/metamask.svg";
export const ConnectWallet = () => {
  return (
    <button
      type="button"
      className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
    >
      <Logo className="w-4 h-4 mr-1" /> Connect to Wallet
    </button>
  );
};
