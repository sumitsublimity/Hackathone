import { addPvtIncomeSchema } from "@/lib/schemas/kpiDashboardSchema";
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

type FormData = z.infer<typeof addPvtIncomeSchema>;

export function AddPrivateIncome(props: KPIDashboardModalProps) {
  const { isOpen, onOpenChange, siteID, year } = props;
  const successMessage = MESSAGES.PRIVATE_INCOME_ADDED_SUCCESS;

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
    resolver: zodResolver(addPvtIncomeSchema),
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

  function onAddPvtIncomeSubmit(data: FormData) {
    const payload = {
      siteID: siteID,
      year: Number(year),
      month: data.month,
      privateIncome: {
        privateIncome: Number(data.privateIncome),
        threeYearFunding: Number(data.threeYearFunding),
        twoYearFunding: Number(data.twoYearFunding),
        senif: Number(data.senif),
        daf: Number(data.daf),
      },
    };
    mutate(payload);
  }

  function populateFormData(record: KPIDashboardEntry) {
    const privateIncomeData = record?.privateIncome;
    setValue("privateIncome", String(privateIncomeData?.privateIncome) || "");
    setValue(
      "threeYearFunding",
      String(privateIncomeData?.threeYearFunding) || "",
    );
    setValue("twoYearFunding", String(privateIncomeData?.twoYearFunding) || "");
    setValue("senif", String(privateIncomeData.senif) || "");
    setValue("daf", String(privateIncomeData?.daf) || "");
  }

  function clearFormData() {
    setValue("privateIncome", "");
    setValue("threeYearFunding", "");
    setValue("twoYearFunding", "");
    setValue("senif", "");
    setValue("daf", "");
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
      title={"Add Private Income"}
      formReset={reset}
      open={isOpen}
      onOpenChange={onOpenChange}
      isSubmitting={isPending}
      onSubmit={handleSubmit(onAddPvtIncomeSubmit)}
      formFields={
        <section className="flex flex-col gap-4">
          {/*++++++++++++++ Month Dropdown ++++++++++++++*/}
          <div>
            <DropdownField
              label="Month"
              placeholder="Select Month"
              name="month"
              value={watch("month")}
              autoFocus={true}
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
              {/*++++++++++++++ Pvt Income + Funding 3yr ++++++++++++++*/}
              <div className="flex flex-row gap-2">
                <InputField
                  label="Private Income"
                  placeholder="Income"
                  {...register("privateIncome")}
                  onInput={allowNumWith2Decimals}
                  errorMessage={errors.privateIncome?.message}
                />
                <InputField
                  label="Funding 3yr"
                  placeholder="Funding"
                  {...register("threeYearFunding")}
                  onInput={allowNumWith2Decimals}
                  errorMessage={errors.threeYearFunding?.message}
                />
              </div>
              {/*++++++++++++++ Funding 2yr + SENif ++++++++++++++*/}
              <div className="flex flex-row gap-2">
                <InputField
                  label="Funding 2yr"
                  placeholder="Funding"
                  {...register("twoYearFunding")}
                  onInput={allowNumWith2Decimals}
                  errorMessage={errors.twoYearFunding?.message}
                />

                <InputField
                  label="SENif"
                  placeholder="SENif"
                  {...register("senif")}
                  onInput={allowNumWith2Decimals}
                  errorMessage={errors.senif?.message}
                />
              </div>
              {/*++++++++++++++ DAF ++++++++++++++*/}
              <div>
                <InputField
                  label="DAF"
                  placeholder="DAF"
                  {...register("daf")}
                  onInput={allowNumWith2Decimals}
                  errorMessage={errors.daf?.message}
                />
              </div>
            </div>
          )}
        </section>
      }
    />
  );
}
