// Libraries imports:
import { z } from "zod";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
// Local imports:
import { DialogBox } from "@/components/DialogBox";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/InputField";
import { addHolidaySchema } from "@/lib/schemas/addHolidaySchema";
import { DatePicker } from "@/components/DatePicker";
import { useMutation } from "@tanstack/react-query";
import { addHoliday } from "@/services/api/jobTracker";
import { showToast } from "@/utils/alert";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import { AddHolidayModalProps } from "../../goals/_components/interfaces";

type FormData = z.infer<typeof addHolidaySchema>;

export const AddHolidayModal = ({
  addHolidayModalOpen,
  setAddHolidayModalOpen,
  refetchHolidayList,
}: AddHolidayModalProps) => {
  const today = new Date();
  const threeYearsBack = new Date(today.getFullYear() - 3, 0, 1);
  const maxDate = new Date(today.getFullYear() + 1, 11, 31);

  /*++++++++++++++ React Hook Form + Zod: ++++++++++++++  */
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(addHolidaySchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  /*++++++++++++++ Tanstack Mutation For Creating Goals ++++++++++++++  */
  const addHolidayMutation = useMutation({
    mutationFn: addHoliday,
    onSuccess: () => {
      showToast(MESSAGES.HOLIDAY_ADDED_SUCCESS, ALERT_TYPES.SUCCESS);
      reset();
      refetchHolidayList();
      setAddHolidayModalOpen(false);
    },
    onError: (err: any) => {
      console.error("Error adding holiday:", err);
      showToast(
        err?.message ?? MESSAGES.HOLIDAY_ADDED_FAILURE,
        ALERT_TYPES.ERROR,
      );
    },
  });

  const { isPending: isAddingHolidayPending } = addHolidayMutation;

  /*++++++++++++++ Submit Handler ++++++++++++++  */
  function onAddHolidaySubmit(data: FormData) {
    const date = new Date(data?.holidayDate);
    const holidayYear = String(date.getFullYear());
    const holidayDate = format(date, "yyyy-MM-dd");

    const payload = {
      name: data?.holiday,
      year: holidayYear,
      date: holidayDate,
      default: false,
    };

    addHolidayMutation.mutate(payload);
  }

  return (
    <DialogBox
      onSubmit={handleSubmit(onAddHolidaySubmit)}
      open={addHolidayModalOpen}
      onOpenChange={setAddHolidayModalOpen}
      title={"Add Holiday"}
      formReset={reset}
      isSubmitting={isAddingHolidayPending}
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
            label="Add Holiday"
            placeholder="Add Your Holiday"
            errorMessage={errors.holiday?.message}
          />
        </div>
      }
    />
  );
};
