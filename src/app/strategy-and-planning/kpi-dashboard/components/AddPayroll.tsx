import { addPayrollSchema } from "@/lib/schemas/kpiDashboardSchema";
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

type FormData = z.infer<typeof addPayrollSchema>;

export function AddPayroll(props: KPIDashboardModalProps) {
  const { isOpen, onOpenChange, siteID, year } = props;
  const successMessage = MESSAGES.PAYROLL_ADDED_SUCCESS;

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
    resolver: zodResolver(addPayrollSchema),
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

  function onAddPayrollSubmit(data: FormData) {
    const payload = {
      siteID: siteID,
      year: Number(year),
      month: data.month,
      payroll: {
        payroll: Number(data.payroll),
        paye: Number(data.paye),
        pension: Number(data.pension),
      },
    };

    mutate(payload);
  }

  function populateFormData(record: KPIDashboardEntry) {
    const payrollData = record?.payroll;
    setValue("payroll", String(payrollData.payroll) || "");
    setValue("paye", String(payrollData?.paye) || "");
    setValue("pension", String(payrollData?.pension) || "");
  }

  function clearFormData() {
    setValue("payroll", "");
    setValue("paye", "");
    setValue("pension", "");
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
      title={"Add Payroll"}
      formReset={reset}
      open={isOpen}
      onOpenChange={onOpenChange}
      isSubmitting={isPending}
      onSubmit={handleSubmit(onAddPayrollSubmit)}
      formFields={
        <section className="flex flex-col gap-4">
          {/*++++++++++++++ Month Dropdown ++++++++++++++*/}
          <div>
            <DropdownField
              label="Month"
              autoFocus={true}
              placeholder="Select Month"
              name="month"
              value={watch("month")}
              onChange={(name, value) => {
                setValue(name as keyof FormData, value);
                trigger(name as keyof FormData);
              }}
              options={MONTH_OPTIONS}
              error={errors.month?.message}
            />
          </div>
          {isLoading ? (
            <TableLoader />
          ) : (
            <div className="flex flex-col gap-4">
              {/*++++++++++++++ Payroll + PAYE ++++++++++++++*/}
              <div className="flex flex-row gap-2">
                <InputField
                  label="Payroll"
                  placeholder="Payroll"
                  {...register("payroll")}
                  onInput={allowNumWith2Decimals}
                  errorMessage={errors.payroll?.message}
                />
                <InputField
                  label="PAYE"
                  placeholder="PAYE"
                  {...register("paye")}
                  onInput={allowNumWith2Decimals}
                  errorMessage={errors.paye?.message}
                />
              </div>
              {/*++++++++++++++ Pension ++++++++++++++*/}
              <div>
                <InputField
                  label="Pension"
                  placeholder="Pension"
                  {...register("pension")}
                  onInput={allowNumWith2Decimals}
                  errorMessage={errors.pension?.message}
                />
              </div>
            </div>
          )}
        </section>
      }
    />
  );
}
