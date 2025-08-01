import {
  Controller,
  Control,
  UseFormRegister,
  UseFormSetValue,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";

import DropdownField from "@/components/DropdownField";
import InputField from "@/components/InputField";
import backIcon from "@/../public/icons/back.svg";
import Image from "next/image";
import { ToolTipWrapper } from "@/app/management-job-tracker/goals/_components/ToolTipWrapper";

interface DropdownOption {
  label: string;
  value: string | number;
}

interface SmartDropdownWithOtherProps<T extends FieldValues> {
  name: Path<T>;
  otherFieldName: Path<T>;
  label: string;
  options: DropdownOption[];
  control: Control<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  selectedValue: string | number | undefined;
  error?: string;
  otherError?: string;
  otherFieldPlaceholder?: string;
}

export function SmartDropdownWithOther<T extends FieldValues>({
  name,
  otherFieldName,
  label,
  options,
  control,
  register,
  setValue,
  selectedValue,
  error,
  otherError,
  otherFieldPlaceholder,
}: SmartDropdownWithOtherProps<T>) {
  const showInputField = selectedValue === "Other";

  return (
    <div className="flex-1">
      {showInputField ? (
        <div className="flex flex-col gap-2">
          <InputField
            {...register(otherFieldName)}
            label={label}
            placeholder={otherFieldPlaceholder}
            errorMessage={otherError}
            iconRight={
              <ToolTipWrapper toolTipText="Back to Options">
                <button
                  type="button"
                  onClick={() => {
                    setValue(name, "" as PathValue<T, typeof name>);
                    setValue(
                      otherFieldName,
                      "" as PathValue<T, typeof otherFieldName>,
                    );
                  }}
                  className="text-sm text-blue-600 underline w-fit cursor-pointer"
                >
                  <Image src={backIcon} alt="back to options" />
                </button>
              </ToolTipWrapper>
            }
          />
        </div>
      ) : (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <DropdownField
              label={label}
              placeholder="Select"
              options={options}
              name={field.name}
              value={field.value ?? ""}
              onChange={(_, value) => field.onChange(value)}
              error={error}
            />
          )}
        />
      )}
    </div>
  );
}
