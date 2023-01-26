import { ConnectWallet } from "./connectWallet";

export const Header = () => {
  return (
    <header className="flex justify-between items-center">
      <div className="">
        <div className=" text-2xl font-semibold">Hello again</div>
        <div>Welcome Back 👋</div>
      </div>
      <div>
        <ConnectWallet />
      </div>
    </header>
  );
};
