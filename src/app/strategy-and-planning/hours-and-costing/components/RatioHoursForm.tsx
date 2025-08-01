import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { allowOnlyNumbers } from "@/utils/inputSanitizers";
import {
  EDIT_ICON,
  MAX_HOURS_LENGTH,
  MAX_RATIO_LENGTH,
  MIN_HOURS_LENGTH,
  MIN_RATIO_LENGTH,
} from "../constants/constants";
import Image from "next/image";
import { useEffect, useState } from "react";

interface RatioHoursFormProps {
  values: {
    ratio: number;
    hoursPerDay: number;
  };
  onChange: (updatedValues: { ratio?: number; hoursPerDay?: number }) => void;
  isEditable: boolean;
  onSubmit?: () => void;
}

export const RatioHoursForm = ({
  values,
  onChange,
  isEditable,
  onSubmit,
}: RatioHoursFormProps) => {
  const [isEditMode, setIsEditMode] = useState(isEditable);

  useEffect(() => {
    setIsEditMode(isEditable);
  }, [isEditable]);

  return (
    <form className="flex flex-col gap-2 sm:flex-row sm:justify-start mb-3">
      <div className="flex flex-row items-center gap-2 sm:w-1/4">
        <label htmlFor="ratio" className="text-base font-medium text-darkGreen">
          Ratio
        </label>
        <div>
          <InputField
            inputClassName={isEditMode ? "cursor-not-allowed" : ""}
            name="ratio"
            readOnly={isEditMode}
            value={String(values.ratio)}
            placeholder="Ratio"
            onChange={(e) => {
              onChange({ ratio: Number(e.target.value) });
            }}
            minLength={MIN_RATIO_LENGTH}
            maxLength={MAX_RATIO_LENGTH}
            onInput={allowOnlyNumbers}
          />
        </div>
      </div>

      <div className="flex flex-row items-center gap-2 sm:w-1/4">
        <label htmlFor="hours" className="text-base font-medium text-darkGreen">
          Hours/Day
        </label>
        <div>
          <InputField
            name="hours"
            readOnly={isEditMode}
            inputClassName={isEditMode ? "cursor-not-allowed" : ""}
            value={String(values.hoursPerDay)}
            placeholder="Hours"
            onChange={(e) => {
              onChange({ hoursPerDay: Number(e.target.value) });
            }}
            minLength={MIN_HOURS_LENGTH}
            maxLength={MAX_HOURS_LENGTH}
            onInput={allowOnlyNumbers}
          />
        </div>
      </div>

      {isEditMode ? (
        <Button
          text="Edit"
          onClick={() => {
            onSubmit?.();
            setIsEditMode(false);
          }}
          icon={
            <Image src={EDIT_ICON} alt="Edit icon" height={17} width={17} />
          }
          className="hover:bg-slateGreen bg-slateGreen hover:brightness-90 h-12 px-6"
        />
      ) : (
        <Button
          text="Submit"
          onClick={() => {
            onSubmit?.();
            setIsEditMode(true);
          }}
          className="hover:bg-darkGreen bg-darkGreen hover:brightness-125 h-12 px-6"
        />
      )}
    </form>
  );
};
