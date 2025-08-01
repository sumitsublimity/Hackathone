// Framework imports:
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
// Libraries import:
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
// Local imports:
import { addTaskSchema } from "@/lib/schemas/addTaskSchema";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import { DialogBox } from "@/components/DialogBox";
import { editTask } from "@/services/api/jobTracker";
import { EditTaskModalProps, EditTaskPayload, TaskData } from "./interfaces";
import { PERIOD_OPTIONS, TASK_OCCURRENCE_OPTIONS } from "./constants";
import { RootState } from "@/redux/store";
import { setIsEditTaskModalOpen } from "@/redux/slice/taskDataSlice";
import { showToast } from "@/utils/alert";
import { TextAreaField } from "@/components/TextAreaField";
import DropdownField from "@/components/DropdownField";
import InputField from "@/components/InputField";

type FormData = z.infer<typeof addTaskSchema>;

export const EditTaskModal = ({ goalsListRefetch }: EditTaskModalProps) => {
  const dispatch = useDispatch();

  const taskData = useSelector((state: RootState) => {
    return state.taskDataReducers.taskData;
  }) as TaskData;

  const isEditTaskModalOpen = useSelector((state: RootState) => {
    return state.taskDataReducers.isEditTaskModalOpen;
  });

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
  const editTaskMutation = useMutation({
    mutationFn: ({
      payload,
      taskId,
    }: {
      payload: EditTaskPayload;
      taskId: string;
    }) => editTask(payload, taskId),
    onSuccess: () => {
      showToast(MESSAGES.TASK_EDITED_SUCCESS, ALERT_TYPES.SUCCESS);
      reset();
      dispatch(setIsEditTaskModalOpen(false));
      goalsListRefetch();
    },
    onError: () => {
      showToast(MESSAGES.TASK_EDITED_FAILURE, ALERT_TYPES.ERROR);
    },
  });

  const { isPending: isEditingTaskPending } = editTaskMutation;

  function onEditTaskSubmit(data: FormData) {
    const mainGoalID: string = taskData.maingoalId;
    const taskId: string = taskData._id;

    const payload = {
      maingoalId: mainGoalID,
      period: data.taskPeriod,
      occurrence: data.taskOccurrence,
      name: data.addTaskText,
    };

    editTaskMutation.mutate({ payload, taskId });
  }

  useEffect(() => {
    if (isEditTaskModalOpen && taskData) {
      setValue("taskPeriod", taskData?.period || "");
      setValue("addTaskText", taskData?.name || "");
      setValue("taskOccurrence", taskData?.occurrence || "");
    }
  }, [isEditTaskModalOpen, taskData, setValue]);

  return (
    <div className="flex flex-row gap-5 justify-start">
      {/*++++++++++++++ Add Task Modal ++++++++++++++  */}
      <DialogBox
        onSubmit={handleSubmit(onEditTaskSubmit)}
        open={isEditTaskModalOpen}
        onOpenChange={(open) => dispatch(setIsEditTaskModalOpen(open))}
        title={"Edit Task"}
        formReset={reset}
        isSubmitting={isEditingTaskPending}
        formFields={
          <div className="flex flex-col gap-2">
            <div>
              {/*++++++++++++++ ReadOnly Goal Name ++++++++++++++  */}
              <InputField
                name="goal"
                tabIndex={-1}
                readOnly
                value={taskData.main_goal}
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
                className="w-44"
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
                placeholder="Add Your Task"
              />
            </div>
          </div>
        }
      />
    </div>
  );
};
