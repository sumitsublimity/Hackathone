"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Controller, Control } from "react-hook-form";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

interface RadioFieldProps {
  label?: string;
  name: string;
  control: Control<any>;
  options: Option[];
  className?: string;
  errorMessage?: string;
}

const RadioField: React.FC<RadioFieldProps> = ({
  label,
  name,
  control,
  options,
  className = "",
  errorMessage,
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-3 block text-base font-medium text-darkGreen">
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroupPrimitive.Root
            className="flex gap-10 h-12"
            onValueChange={field.onChange}
            value={field.value}
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupPrimitive.Item
                  value={option.value}
                  id={`${name}-${option.value}`}
                  className={cn(
                    "h-4 w-4 rounded-full border",
                    errorMessage
                      ? "border-red-500 border-2"
                      : "border-lightTeal border-2 data-[state=checked]:bg-slateGreen data-[state=checked]:border-lightTeal",
                    "ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  )}
                />
                <label
                  htmlFor={`${name}-${option.value}`}
                  className="text-sm"
                  style={{ color: "#7C7C7C" }}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroupPrimitive.Root>
        )}
      />

      {errorMessage && (
        <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default RadioField;
