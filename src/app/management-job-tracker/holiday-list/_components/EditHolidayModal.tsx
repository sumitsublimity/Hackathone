// Framework imports:
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
// Libraries imports:
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Row } from "@tanstack/react-table";
// Local imports:
import { DialogBox } from "@/components/DialogBox";
import { editHoliday } from "@/services/api/jobTracker";
import { showToast } from "@/utils/alert";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import {
  EditHolidayPayload,
  HolidayTableCols,
} from "../../goals/_components/interfaces";
import { addHolidaySchema } from "@/lib/schemas/addHolidaySchema";
import { DatePicker } from "@/components/DatePicker";
import InputField from "@/components/InputField";

type FormData = z.infer<typeof addHolidaySchema>;

export interface EditHolidayModalProps {
  row: Row<HolidayTableCols>;
  isEditHolidayModalOpen: boolean;
  setIsEditHolidayModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchHolidayList: () => void;
}

type EditHolidayMutationArgs = {
  payload: EditHolidayPayload;
  holidayId: string;
};

export const EditHolidayModal = ({
  row,
  isEditHolidayModalOpen,
  setIsEditHolidayModalOpen,
  refetchHolidayList,
}: EditHolidayModalProps) => {
  const today = new Date();
  const threeYearsBack = new Date(today.getFullYear() - 3, 0, 1);
  const maxDate = new Date(today.getFullYear() + 1, 11, 31);

  /*++++++++++++++ React Hook Form + Zod: ++++++++++++++  */
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(addHolidaySchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  /*++++++++++++++ Tanstack Mutation For Creating Goals ++++++++++++++  */
  const editHolidayMutation = useMutation({
    mutationFn: ({ payload, holidayId }: EditHolidayMutationArgs) => {
      return editHoliday(payload, holidayId);
    },
    onSuccess: () => {
      showToast(MESSAGES.HOLIDAY_EDITED_SUCCESS, ALERT_TYPES.SUCCESS);
      reset();
      refetchHolidayList();
      setTimeout(() => {
        setIsEditHolidayModalOpen(false);
      }, 200);
    },
    onError: (err: any) => {
      console.error("Error editing holiday:", err);
      showToast(
        err?.message ?? MESSAGES.HOLIDAY_EDITED_FAILURE,
        ALERT_TYPES.ERROR,
      );
    },
  });

  const { isPending: isEditingHolidayPending } = editHolidayMutation;

  /*++++++++++++++ Submit Handler ++++++++++++++  */
  function onEditHolidaySubmit(data: FormData) {
    const date = new Date(data?.holidayDate);
    const holidayYear = String(date.getFullYear());
    const holidayDate = format(date, "yyyy-MM-dd");
    const holidayId = row?.original?._id;

    const payload = {
      name: data?.holiday,
      year: holidayYear,
      date: holidayDate,
      default: false,
    };

    editHolidayMutation.mutate({ payload, holidayId });
  }

  useEffect(() => {
    if (isEditHolidayModalOpen && row?.original) {
      const holidayData = row.original;

      setValue("holiday", holidayData?.name || "");
      setValue("holidayDate", holidayData?.date || "");
    }
  }, [isEditHolidayModalOpen, row, setValue]);

  return (
    <DialogBox
      onSubmit={handleSubmit(onEditHolidaySubmit)}
      open={isEditHolidayModalOpen}
      onOpenChange={setIsEditHolidayModalOpen}
      title={"Edit Holiday"}
      formReset={reset}
      isSubmitting={isEditingHolidayPending}
      formFields={
        <div className="flex flex-col gap-5">
          <Controller
            name="holidayDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                dateFormat="dd-MMMM-yyyy"
                startMonth={threeYearsBack}
                endMonth={maxDate}
                disabled={{ before: threeYearsBack, after: maxDate }}
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => {
                  field.onChange(date?.toISOString());
                }}
                label="Holiday Date"
                placeholder="Select Holiday Date"
                iconRight="/icons/calendar.svg"
                errorMessage={errors.holidayDate?.message}
              />
            )}
          />

          {/*++++++++++++++ Add Holiday Name ++++++++++++++  */}
          <InputField
            {...register("holiday")}
            label="Edit Holiday"
            placeholder="Edit Your Holiday"
            errorMessage={errors.holiday?.message}
          />
        </div>
      }
    />
  );
};
