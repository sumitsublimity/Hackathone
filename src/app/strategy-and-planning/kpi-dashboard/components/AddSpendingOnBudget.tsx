// Note: 'Add Spending on Budget' is renamed with 'Total Spend'

import { addSpendingOnBudgetSchema } from "@/lib/schemas/kpiDashboardSchema";
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
  KPIDashboardEntry,
  KPIDashboardModalProps,
} from "../types/kpiDashboard.types";
import {
  useGetKPIDashboardEditableData,
  useUpdateKPIDashboard,
} from "@/services/query/kpi-dashboard-query/kpi-dashboard.query";
import {
  FORM_RE_VALIDATE_MODE,
  FORM_VALIDATION_MODE,
  MESSAGES,
  MONTH_OPTIONS,
} from "@/utils/constants";

type FormData = z.infer<typeof addSpendingOnBudgetSchema>;

export function AddSpendingOnBudget(props: KPIDashboardModalProps) {
  const { isOpen, onOpenChange, siteID, year } = props;
  const successMessage = MESSAGES.SPEND_ON_BUDGET_ADDED_SUCCESS;

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
    resolver: zodResolver(addSpendingOnBudgetSchema),
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

  function onSpendingOnBudgetSubmit(data: FormData) {
    const payload = {
      siteID: siteID,
      year: Number(year),
      month: data.month,
      spendOnBudget: Number(data.spendOnBudget),
    };

    mutate(payload);
  }

  function populateFormData(record: KPIDashboardEntry) {
    const spendingOnBudgetData = record?.spendOnBudget;
    setValue("spendOnBudget", String(spendingOnBudgetData) || "");
  }

  function clearFormData() {
    setValue("spendOnBudget", "");
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
      title={"Add Total Spend"}
      formReset={reset}
      open={isOpen}
      onOpenChange={onOpenChange}
      isSubmitting={isPending}
      onSubmit={handleSubmit(onSpendingOnBudgetSubmit)}
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
          {/*++++++++++++++ Spending On Budget ++++++++++++++*/}
          {isLoading ? (
            <TableLoader />
          ) : (
            <div className="flex flex-row gap-2">
              <InputField
                label="Total Spend"
                placeholder="Total Spend"
                {...register("spendOnBudget")}
                onInput={allowNumWith2Decimals}
                errorMessage={errors.spendOnBudget?.message}
              />
            </div>
          )}
        </section>
      }
    />
  );
}
