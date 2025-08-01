import { addCashOutSchema } from "@/lib/schemas/kpiDashboardSchema";
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

type FormData = z.infer<typeof addCashOutSchema>;

export function AddCashOut(props: KPIDashboardModalProps) {
  const { isOpen, onOpenChange, siteID, year } = props;
  const successMessage = MESSAGES.CASH_OUT_ADDED_SUCCESS;

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
    resolver: zodResolver(addCashOutSchema),
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

  function onAddCashOutSubmit(data: FormData) {
    const payload = {
      siteID: siteID,
      year: Number(year),
      month: data.month,
      cashOut: Number(data.cashOut),
    };
    mutate(payload);
  }

  function populateFormData(record: KPIDashboardEntry) {
    const cashOutData = record?.cashOut;
    setValue("cashOut", String(cashOutData) || "");
  }

  function clearFormData() {
    setValue("cashOut", "");
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
      title={"Add Cash Out"}
      formReset={reset}
      open={isOpen}
      onOpenChange={onOpenChange}
      isSubmitting={isPending}
      onSubmit={handleSubmit(onAddCashOutSubmit)}
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
          {/*++++++++++++++ Cash Out ++++++++++++++*/}
          {isLoading ? (
            <TableLoader />
          ) : (
            <div className="flex flex-row gap-2">
              <InputField
                label="Cash Out"
                placeholder="Cash"
                {...register("cashOut")}
                onInput={allowNumWith2Decimals}
                errorMessage={errors.cashOut?.message}
              />
            </div>
          )}
        </section>
      }
    />
  );
}
