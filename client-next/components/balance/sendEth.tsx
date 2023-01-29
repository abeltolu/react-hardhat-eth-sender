import { useState } from "react";
import { SendEthButton } from "../buttons";
import { FormInput } from "../input";

interface IProps {
  onCancel: () => void;
  onSubmit: (values: IFormValues) => void;
}

export interface IFormValues {
  receiver: string;
  amount: number;
  message: string;
}
const initialState: IFormValues = { receiver: "", amount: 0, message: "" };
export const SendEthForm = ({ onCancel, onSubmit }: IProps) => {
  const [formValues, setFormValues] = useState<IFormValues>(initialState);
  const handleValueChange = (key: keyof IFormValues, value: string | number) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };
  const handleSubmit = () => {
    onSubmit(formValues);
    setFormValues(initialState);
  };
  return (
    <div className=" bg-white p-4 rounded-lg space-y-3">
      <div className="text-center">Send</div>
      <div className="space-y-2">
        <FormInput
          label="To"
          required
          value={formValues.receiver}
          onChange={(e) => handleValueChange("receiver", e.target.value)}
        />
        <FormInput
          label="Amount"
          required
          type={"number"}
          min={0}
          step={0.001}
          value={formValues.amount}
          onChange={(e) => handleValueChange("amount", e.target.value)}
        />
        <FormInput
          label="Message"
          value={formValues.message}
          onChange={(e) => handleValueChange("message", e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <button className=" text-red-600 text-sm" onClick={onCancel}>
          Cancel
        </button>
        <SendEthButton onClick={handleSubmit} />
      </div>
    </div>
  );
};
