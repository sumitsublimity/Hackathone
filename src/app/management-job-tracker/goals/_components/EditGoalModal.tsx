// Framework imports:
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
// Libraries imports:
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// Local imports:
import { EditGoalModalProps, EditGoalPayload } from "./interfaces";
import { DialogBox } from "@/components/DialogBox";
import { TextAreaField } from "@/components/TextAreaField";
import { editGoal } from "@/services/api/jobTracker";
import DropdownField from "@/components/DropdownField";
import { createGoalSchema } from "@/lib/schemas/createGoalSchema";
import { getSiteKeyValueList } from "@/services/api/staff/staff";
import { showToast } from "@/utils/alert";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import { getFiveYearOptions } from "@/utils/yearUtils";

type FormData = z.infer<typeof createGoalSchema>;

export const EditGoalModal = ({
  row,
  isEditGoalModalOpen,
  setIsEditGoalModalOpen,
  goalsListRefetch,
}: EditGoalModalProps) => {
  const [siteOptions, setSiteOptions] = useState([]);
  // Memoized to prevent calculation on every render:
  const { yearOptions, currentYear } = useMemo(() => getFiveYearOptions(), []);
  
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
    resolver: zodResolver(createGoalSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  /*++++++++++++++ Tanstack Mutation For Creating Goals ++++++++++++++  */
  const editGoalMutation = useMutation({
    mutationFn: ({
      payload,
      goalId,
    }: {
      payload: EditGoalPayload;
      goalId: string;
    }) => editGoal(payload, goalId),
    onSuccess: () => {
      showToast(MESSAGES.GOAL_EDITED_SUCCESS, ALERT_TYPES.SUCCESS);
      reset();
      setIsEditGoalModalOpen(false);
      goalsListRefetch();
    },
    onError: () => {
      showToast(MESSAGES.GOAL_EDITED_FAILURE, ALERT_TYPES.ERROR);
    },
  });
  const { isPending: isEditingGoalPending } = editGoalMutation;

  // Get data for site dropdown:
  async function fetchSiteDropdownList() {
    try {
      const response = await getSiteKeyValueList({
        searchFilters: [
          {
            columnName: "inActive",
            columnType: "BOOLEAN",
            columnValue: false,
            operation: "EQUAL_TO",
          },
        ],
        sortRules: [
          {
            columnName: "name",
            operation: "ASC",
          },
        ],
      });

      const sites = response.responsePacket || [];
      const options = sites.map((site: any) => ({
        label: site.name,
        value: String(site.id),
      }));

      setSiteOptions(options);
    } catch (error) {
      console.error("Failed to fetch site list:", error);
    }
  }

  function onEditGoalSubmit(data: FormData) {
    const goalId: string = row.original._id;

    const payload = {
      goal: data.addGoalText,
      year: data.addGoalYear,
      site: data.site,
    };

    editGoalMutation.mutate({ payload, goalId });
  }

  useEffect(() => {
    if (isEditGoalModalOpen && row?.original) {
      const goalData = row.original;

      setValue("addGoalYear", goalData.year || "");
      setValue("site", goalData?.site?._id || "");
      setValue("addGoalText", goalData.goal || "");
    }
  }, [isEditGoalModalOpen, row, setValue]);

  useEffect(() => {
    fetchSiteDropdownList();
  }, []);

  return (
    <div className="flex flex-row gap-5 justify-start">
      {/*++++++++++++++ Add Task Modal ++++++++++++++  */}
      <DialogBox
        onSubmit={handleSubmit(onEditGoalSubmit)}
        open={isEditGoalModalOpen}
        onOpenChange={setIsEditGoalModalOpen}
        title={"Edit Goal"}
        formReset={reset}
        isSubmitting={isEditingGoalPending}
        formFields={
          <div>
            <div className="flex flex-row w-full justify-center gap-5">
              {/*++++++++++++++ Select Year Dropdown ++++++++++++++  */}
              <div className="flex-1">
                <DropdownField
                  label="Year *"
                  className="max-w-44"
                  contentClassName="w-44"
                  name="addGoalYear"
                  autoFocus={true}
                  placeholder="Select Year"
                  value={watch("addGoalYear") || ""}
                  options={yearOptions}
                  error={errors.addGoalYear?.message}
                  onChange={(name, value) => {
                    setValue(name as keyof FormData, value);
                    trigger(name as keyof FormData);
                  }}
                />
              </div>

              {/*++++++++++++++ Select Site Dropdown ++++++++++++++  */}
              <div className="flex-1">
                <DropdownField
                  label="Site *"
                  contentClassName="max-w-44"
                  className="max-w-44"
                  placeholder="Select Site"
                  name="site"
                  value={watch("site") || ""}
                  options={siteOptions}
                  error={errors.site?.message}
                  onChange={(name, value) => {
                    setValue(name as keyof FormData, value);
                    trigger(name as keyof FormData);
                  }}
                />
              </div>
            </div>

            {/*++++++++++++++ Add Goal TextArea ++++++++++++++  */}
            <div>
              <div className="mt-2">
                <TextAreaField
                  {...register("addGoalText")}
                  error={errors.addGoalText?.message}
                  label="Add Goal *"
                  placeholder="Edit Your Goal"
                />
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};
