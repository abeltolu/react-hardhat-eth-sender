import { ReactNode } from "react";

interface IFormInputProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label: ReactNode;
}
export const FormInput = ({ label, required, ...props }: IFormInputProps) => {
  return (
    <label className="block">
      <span
        className={`${
          required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""
        } block text-sm font-medium text-slate-700`}
      >
        {label}
      </span>
      <input
        {...props}
        required={required}
        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
      />
    </label>
  );
};
