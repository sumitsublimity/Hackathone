import { DialogBox } from "@/components/DialogBox";
import DropdownField from "@/components/DropdownField";
import InputField from "@/components/InputField";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addFeeModalSchema } from "../schemas/addFeeModalSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fetchCategoryOptions } from "../services/fetchCategoryOptions";
import { fetchAgeGroupOptions } from "../services/fetchAgeGroupOptions";
import { allowNumWith2Decimals } from "@/utils/inputSanitizers";
import { FEE_PER_HOUR_MIN_LENGTH } from "@/utils/constants";
import { useAddFee } from "../hooks/useAddFeeMutation";
import { AddFeeModalProps, DropdownCategoryOptions } from "../types/types";

type FormData = z.infer<typeof addFeeModalSchema>;

export const AddFeeModal = (props: AddFeeModalProps) => {
  const { open, onOpenChange, selectedSiteId, refetchData } = props;

  const [categoryOptions, setCategoryOptions] = useState<
    DropdownCategoryOptions[]
  >([]);
  const [ageGroupOptions, setAgeGroupOptions] = useState<
    DropdownCategoryOptions[]
  >([]);

  /*++++++++++++++ React Hook Form + Zod: ++++++++++++++  */
  const {
    register,
    watch,
    trigger,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(addFeeModalSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const addFeeMutation = useAddFee();
  const isAddFeePending = addFeeMutation.isPending;

  function onAddFee(data: FormData) {
    const payload = {
      ...data,
      siteID: selectedSiteId,
    };

    addFeeMutation.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false);
        reset();
        refetchData();
      },
      onError: (error) => {
        console.error("Failed to add fee:", error);
      },
    });
  }

  useEffect(() => {
    if (!open) return;
    const loadOptions = async () => {
      const [categories, ageGroups] = await Promise.all([
        fetchCategoryOptions(),
        fetchAgeGroupOptions(selectedSiteId),
      ]);
      setCategoryOptions(categories);
      setAgeGroupOptions(ageGroups);
    };
    loadOptions();
  }, [open, selectedSiteId]);

  return (
    <DialogBox
      onSubmit={handleSubmit(onAddFee)}
      open={open}
      onOpenChange={onOpenChange}
      formReset={reset}
      isSubmitting={isAddFeePending}
      title={"Add Fees Per Hour"}
      formFields={
        <div className="flex flex-col gap-4">
          <div>
            <DropdownField
              name="category"
              label="Category *"
              placeholder="Select Category"
              options={categoryOptions}
              autoFocus={true}
              value={watch("category") || ""}
              onChange={(name, value) => {
                setValue(name as keyof FormData, value);
                trigger(name as keyof FormData);
              }}
              error={errors.category?.message}
            />
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <DropdownField
                name="ageGroup"
                label="Age Group *"
                placeholder="Select Age Group"
                options={ageGroupOptions}
                value={watch("ageGroup") || ""}
                onChange={(name, value) => {
                  setValue(name as keyof FormData, value);
                  trigger(name as keyof FormData);
                }}
                error={errors.ageGroup?.message}
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Fee Per Hour *"
                placeholder="Hour"
                {...register("costing")}
                onInput={allowNumWith2Decimals}
                minLength={FEE_PER_HOUR_MIN_LENGTH}
                errorMessage={errors.costing?.message}
              />
            </div>
          </div>
        </div>
      }
    />
  );
};
