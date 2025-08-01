import React from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: string;
  iconRight?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  id?: string;
  autoComplete?: string;
  required?: boolean;
  errorMessage?: string;
  isInvalid?: boolean;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  icon,
  iconRight,
  className = "",
  inputClassName = "",
  disabled = false,
  //   isInvalid = false,
  errorMessage = "",
  onInput,
  readOnly,
  autoComplete,
  ...rest
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* +++++++++ Label For Input Field +++++++++ */}
      {label && (
        <label className="mb-3 block text-base font-medium text-darkGreen">
          {label}
        </label>
      )}
      <div className="relative">
        {/* +++++++++ Left Side Icon (eg Lock Icon) +++++++++ */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 h-full flex items-center pointer-events-none">
            <div className="relative w-4 h-4">
              <Image src={icon} alt="icon" fill={true} />
            </div>
          </div>
        )}
        <Input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`h-12 w-full px-4 py-3 focus-visible:ring-lightTeal border text-sm rounded-lg placeholder:text-lightSlateGreen   ${icon ? `pl-10` : ""} ${iconRight ? `pr-10` : ""}
           ${errorMessage ? "border-red-500" : "border-lightTeal"} ${inputClassName}`}
          {...rest}
          onInput={onInput}
          readOnly={readOnly}
          autoComplete={autoComplete}
        />
        {/* +++++++++ Right Side Icon (eg Eye-On/Eye-Off) +++++++++ */}
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 h-full flex items-center cursor-pointer">
            {iconRight}
          </div>
        )}
      </div>
      {/* +++++++++ Validation Messages +++++++++ */}
      <div>
        {errorMessage && (
          <div className="min-h-[1.25rem] mt-1 ml-1">
            <p className="text-xs text-red-500">{errorMessage || " "}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
