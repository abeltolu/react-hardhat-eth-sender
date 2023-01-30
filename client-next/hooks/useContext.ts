import { SendEthContext } from "@/context/sendeth";
import { useContext } from "react";

export const useSendEthContext = () => {
  return useContext(SendEthContext);
};
