import { SendEthContext } from "@/context/sendeth";
import { useContext } from "react";

export const useSendEthContext = () => {
  const context = useContext(SendEthContext);
  return context;
};
