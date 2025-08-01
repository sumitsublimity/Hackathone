import { AddTaskModalProps } from "./interfaces";
import { DialogBox } from "@/components/DialogBox";
import { TextAreaField } from "@/components/TextAreaField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTaskSchema } from "@/lib/schemas/addTaskSchema";
import { z } from "zod";
import { addTask } from "@/services/api/jobTracker";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@/utils/alert";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import InputField from "@/components/InputField";
import DropdownField from "@/components/DropdownField";
import { PERIOD_OPTIONS, TASK_OCCURRENCE_OPTIONS } from "./constants";

type FormData = z.infer<typeof addTaskSchema>;

export const AddTaskModal = ({
  row,
  isAddTaskModalOpen,
  setIsAddTaskModalOpen,
  goalsListRefetch,
}: AddTaskModalProps) => {
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
    resolver: zodResolver(addTaskSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  /*++++++++++++++ Tanstack Mutation For Creating Goals ++++++++++++++  */
  const addTaskMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      showToast(MESSAGES.TASK_CREATED_SUCCESS, ALERT_TYPES.SUCCESS);
      reset();
      setIsAddTaskModalOpen(false);
      goalsListRefetch();
    },
    onError: () => {
      showToast(MESSAGES.TASK_CREATED_FAILURE, ALERT_TYPES.ERROR);
    },
  });
  const { isPending: isAddingTaskPending } = addTaskMutation;

  function onAddTaskSubmit(data: FormData) {
    const mainGoalID: string = row.original._id;

    const payload = {
      maingoalId: mainGoalID,
      period: data.taskPeriod,
      occurrence: data.taskOccurrence,
      name: data.addTaskText,
    };

    addTaskMutation.mutate(payload);
  }

  return (
    <div className="flex flex-row gap-5 justify-start">
      {/*++++++++++++++ Add Task Modal ++++++++++++++  */}
      <DialogBox
        onSubmit={handleSubmit(onAddTaskSubmit)}
        open={isAddTaskModalOpen}
        onOpenChange={setIsAddTaskModalOpen}
        title={"Add Task"}
        formReset={reset}
        isSubmitting={isAddingTaskPending}
        formFields={
          <div className="flex flex-col gap-2">
            <div>
              {/*++++++++++++++ ReadOnly Goal Name ++++++++++++++  */}
              <InputField
                name="goal"
                readOnly
                tabIndex={-1}
                value={row?.original?.goal}
                label="Goal"
                placeholder="Your Goal appears here"
              />
            </div>
            <div className="flex flex-row gap-5">
              {/*++++++++++++++ Select Period Dropdown ++++++++++++++  */}
              <DropdownField
                label="Period *"
                name="taskPeriod"
                className="flex-1"
                contentClassName="w-44"
                autoFocus={true}
                placeholder="Select Period"
                value={watch("taskPeriod") || ""}
                options={PERIOD_OPTIONS}
                error={errors.taskPeriod?.message}
                onChange={(name, value) => {
                  setValue(name as keyof FormData, value);
                  trigger(name as keyof FormData);
                }}
              />

              {/*++++++++++++++ Select Occurrence Dropdown ++++++++++++++  */}
              <DropdownField
                label="Occurrence *"
                name="taskOccurrence"
                className="flex-1"
                contentClassName="w-44"
                placeholder="Select Occurrence"
                value={watch("taskOccurrence") || ""}
                options={TASK_OCCURRENCE_OPTIONS}
                error={errors.taskOccurrence?.message}
                onChange={(name, value) => {
                  setValue(name as keyof FormData, value);
                  trigger(name as keyof FormData);
                }}
              />
            </div>

            {/*++++++++++++++ Textarea For Task ++++++++++++++  */}
            <div>
              <TextAreaField
                {...register("addTaskText")}
                error={errors.addTaskText?.message}
                name="addTaskText"
                label="Add Task *"
                placeholder="Add Your task"
              />
            </div>
          </div>
        }
      />
    </div>
  );
};
