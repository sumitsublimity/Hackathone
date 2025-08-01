import Button from "@/components/Button";
import { DialogBox } from "@/components/DialogBox";
import DropdownField from "@/components/DropdownField";
import InputField from "@/components/InputField";
import { AddHoursSoldSchema } from "@/lib/schemas/AddHoursSoldSchema";
import { useCreateHoursSold } from "@/services/query/hours-sold-query/hours-sold-query";
import { months } from "@/utils/constants";
import { allowOnlyNumbers } from "@/utils/inputSanitizers";
import { getFiveYearOptions } from "@/utils/yearUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const AddForm = ({ btn, title, siteAgeGroup, changeSiteId }: any) => {
  type FormData = z.infer<typeof AddHoursSoldSchema>;
  const [isAddHoursSoldModalOpen, setIsAddHoursSoldModalOpen] = useState(false);
  const { yearOptions, currentYear } = useMemo(() => getFiveYearOptions(), []);

  const { mutate: createHoursSold } = useCreateHoursSold();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(AddHoursSoldSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      month: "",
      year: currentYear,
      week1: "",
      week2: "",
      week3: "",
      week4: "",
      extra: "",
      name: "",
      ageGroup: "",
    },
  });

  const selectedMonth = watch("month");
  const selectedYear = watch("year");

  function handleDialogOpenChange(isOpen: boolean) {
    setIsAddHoursSoldModalOpen(isOpen);
  }

  return (
    <div>
      <DialogBox
        onSubmit={handleSubmit(
          (data) => {
            const weeks = [
              {
                name: "Week 1",
                totalHours: data.week1,
              },
              {
                name: "Week 2",
                totalHours: data.week2,
              },
              {
                name: "Week 3",
                totalHours: data.week3,
              },
              {
                name: "Week 4",
                totalHours: data.week4,
              },
              {
                name: "Extra",
                totalHours: data.extra,
              },
            ];
            const modifiedData = {
              year: +data.year,
              month: data.month,
              name: data.name,
              weeks,
              ageGroup: data.ageGroup,
              siteID: changeSiteId,
            };

            // Send to API:
            createHoursSold({ ...modifiedData, siteID: changeSiteId });
            reset();
            setIsAddHoursSoldModalOpen(false);
          },
          (formErrors) => {
            console.log("❌ Form Errors:", formErrors);
          },
        )}
        open={isAddHoursSoldModalOpen}
        onOpenChange={handleDialogOpenChange}
        title={title}
        modal={true}
        isSubmitting={false}
        triggerButton={<div className="h-full">{btn}</div>}
        submitBtnText="Submit"
        contentClassName="sm:max-w-[725px]"
        formReset={() => {
          reset();
        }}
        formFields={
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 ">
              <DropdownField
                label="Year*"
                name="year"
                placeholder="Select year"
                value={selectedYear}
                onChange={(name, value) => {
                  setValue(name as keyof FormData, value);
                  trigger(name as keyof FormData);
                }}
                options={yearOptions}
                error={errors.year?.message}
                className="min-w-[140px] max-w-full"
                contentClassName="min-w-[140px] max-w-[140px]"
                height="h-12"
              />
              <DropdownField
                label="Month*"
                name="month"
                placeholder="Select month"
                value={selectedMonth}
                onChange={(name, value) => {
                  setValue(name as keyof FormData, value);
                  trigger(name as keyof FormData);
                }}
                options={months.map((m) => ({ value: m, label: m }))}
                error={errors.month?.message}
                className="min-w-[140px] max-w-full"
                contentClassName="w-[15vw]"
                height="h-12"
              />
              <DropdownField
                label="Age Group*"
                name="ageGroup"
                placeholder="Select Age Group"
                value={watch("ageGroup")}
                onChange={(name, value) => {
                  setValue(name as keyof FormData, value);
                  trigger(name as keyof FormData);
                }}
                options={siteAgeGroup || []}
                error={errors.ageGroup?.message}
                className="min-w-[140px] max-w-full"
                contentClassName="w-[15vw]"
                height="h-12"
              />
              <InputField
                label="Name*"
                type="text"
                placeholder="Name"
                {...register("name")}
                errorMessage={errors.name?.message}
              />
            </div>

            <div className="mt-6">
              {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                Week Breakdown*
              </label> */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputField
                  label="Week 1*"
                  type="text"
                  placeholder="Spend Hours"
                  {...register("week1")}
                  errorMessage={errors.week1?.message}
                  onInput={allowOnlyNumbers}
                  maxLength={3}
                />
                <InputField
                  label="Week 2"
                  type="text"
                  onInput={allowOnlyNumbers}
                  placeholder="Spend Hours"
                  {...register("week2")}
                  errorMessage={errors.week2?.message}
                  maxLength={3}
                />
                <InputField
                  label="Week 3"
                  type="text"
                  onInput={allowOnlyNumbers}
                  placeholder="Spend Hours"
                  {...register("week3")}
                  errorMessage={errors.week3?.message}
                  maxLength={3}
                />
              </div>
              <div className="grid mt-3 grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Week 4"
                  type="text"
                  onInput={allowOnlyNumbers}
                  placeholder="Spend Hours"
                  {...register("week4")}
                  errorMessage={errors.week4?.message}
                  maxLength={3}
                />
                <InputField
                  label="Extra"
                  type="text"
                  onInput={allowOnlyNumbers}
                  placeholder="Spend Hours"
                  {...register("extra")}
                  errorMessage={errors.extra?.message}
                  maxLength={3}
                />
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};

export default AddForm;
