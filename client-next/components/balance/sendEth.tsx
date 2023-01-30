import { useState } from "react";
import { SendEthButton } from "../buttons";
import { FormInput } from "../input";
import { IFormValues } from "./balance";

interface IProps {
  formValues: IFormValues;
  onValueChange: (key: keyof IFormValues, value: string | number) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isDisabled: boolean;
}

export const SendEthForm = ({ formValues, onCancel, onSubmit, onValueChange, isDisabled }: IProps) => {
  return (
    <div className=" bg-white p-4 rounded-lg space-y-3">
      <div className="text-center">Send</div>
      <div className="space-y-2">
        <FormInput
          label="To"
          required
          value={formValues.receiver}
          onChange={(e) => onValueChange("receiver", e.target.value)}
        />
        <FormInput
          label="Amount"
          required
          type={"number"}
          min={0}
          step={0.001}
          value={formValues.amount}
          onChange={(e) => onValueChange("amount", e.target.value)}
        />
        <FormInput
          label="Message"
          value={formValues.message}
          onChange={(e) => onValueChange("message", e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <button className=" text-red-600 text-sm" onClick={onCancel} disabled={isDisabled}>
          Cancel
        </button>
        <SendEthButton disabled={isDisabled} onClick={onSubmit} />
      </div>
    </div>
  );
};
