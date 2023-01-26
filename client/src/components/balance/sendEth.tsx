import { SendEthButton } from "../buttons";
import { FormInput } from "../input";

interface IProps {
  onCancel: () => void;
}
export const SendEthForm = ({ onCancel }: IProps) => {
  return (
    <div className=" bg-white p-4 rounded-lg space-y-3">
      <div className="text-center">Send</div>
      <div className="space-y-2">
        <FormInput label="To" required />
        <FormInput label="Amount" required />
        <FormInput label="Message" />
      </div>
      <div className="flex items-center justify-between">
        <button className=" text-red-600 text-sm" onClick={onCancel}>
          Cancel
        </button>
        <SendEthButton />
      </div>
    </div>
  );
};
