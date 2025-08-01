import { addSavingsSchema } from "@/lib/schemas/kpiDashboardSchema";
import { allowNumWith2Decimals } from "@/utils/inputSanitizers";
import { DialogBox } from "@/components/DialogBox";
import { TableLoader } from "@/components/TableLoader";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useKpiDashboardPayload } from "../hooks/useKpiDashboardPayload";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DropdownField from "@/components/DropdownField";
import InputField from "@/components/InputField";
import {
  FORM_RE_VALIDATE_MODE,
  FORM_VALIDATION_MODE,
  MESSAGES,
  MONTH_OPTIONS,
} from "@/utils/constants";
import {
  useGetKPIDashboardEditableData,
  useUpdateKPIDashboard,
} from "@/services/query/kpi-dashboard-query/kpi-dashboard.query";
import {
  KPIDashboardEntry,
  KPIDashboardModalProps,
} from "../types/kpiDashboard.types";

type FormData = z.infer<typeof addSavingsSchema>;

export function AddSavings(props: KPIDashboardModalProps) {
  const { isOpen, onOpenChange, siteID, year } = props;
  const successMessage = MESSAGES.SAVINGS_ADDED_SUCCESS;

  /*++++++++++++++ React Hook Form + Zod: ++++++++++++++*/
  const {
    register,
    watch,
    trigger,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(addSavingsSchema),
    mode: FORM_VALIDATION_MODE,
    reValidateMode: FORM_RE_VALIDATE_MODE,
  });

  const selectedMonth = watch("month");
  const shouldFetch = Boolean(isOpen && siteID && selectedMonth);

  const kpiDashboardPayload = useKpiDashboardPayload({
    siteID,
    year,
    selectedMonth,
  });

  const { data = [], isLoading } = useGetKPIDashboardEditableData(
    kpiDashboardPayload,
    shouldFetch,
  );

  function onSuccess() {
    onOpenChange(false);
    reset();
  }

  const { mutate, isPending } = useUpdateKPIDashboard(
    successMessage,
    onSuccess,
  );

  function onAddSavingsSubmit(data: FormData) {
    const payload = {
      siteID: siteID,
      year: Number(year),
      month: data.month,
      savings: Number(data.savings),
    };

    mutate(payload);
  }

  function populateFormData(record: KPIDashboardEntry) {
    const savingsData = record?.savings;
    setValue("savings", String(savingsData) || "");
  }

  function clearFormData() {
    setValue("savings", "");
  }

  // Handle form data population/clearing
  useEffect(() => {
    if (!selectedMonth) return;

    if (data.length > 0) {
      populateFormData(data[0]);
    } else {
      clearFormData();
    }
  }, [data, selectedMonth]);

  return (
    <DialogBox
      title={"Add Savings"}
      formReset={reset}
      open={isOpen}
      onOpenChange={onOpenChange}
      isSubmitting={isPending}
      onSubmit={handleSubmit(onAddSavingsSubmit)}
      formFields={
        <section className="flex flex-col gap-4">
          {/*++++++++++++++ Month Dropdown ++++++++++++++*/}
          <div>
            <DropdownField
              label="Month"
              placeholder="Select Month"
              name="month"
              autoFocus={true}
              value={watch("month")}
              onChange={(name, value) => {
                setValue(name as keyof FormData, value);
                trigger(name as keyof FormData);
              }}
              options={MONTH_OPTIONS}
              error={errors.month?.message}
            />
          </div>
          {/*++++++++++++++ Savings ++++++++++++++*/}
          {isLoading ? (
            <TableLoader />
          ) : (
            <div className="flex flex-row gap-2">
              <InputField
                label="Savings"
                placeholder="Savings"
                {...register("savings")}
                onInput={allowNumWith2Decimals}
                errorMessage={errors.savings?.message}
              />
            </div>
          )}
        </section>
      }
    />
  );
}
