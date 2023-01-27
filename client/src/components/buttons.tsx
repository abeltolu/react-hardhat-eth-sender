import { ReactComponent as SendIcon } from "../assets/ethereum.svg";

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
export const DarkButton = (props: ButtonProps) => {
  return (
    <button
      {...props}
      className="text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600"
    >
      {props.children}
    </button>
  );
};

export const SendEthButton = (props: Omit<ButtonProps, "children">) => {
  return (
    <DarkButton {...props}>
      <SendIcon className="mr-1 w-4 h-4" /> Send ETH
    </DarkButton>
  );
};
