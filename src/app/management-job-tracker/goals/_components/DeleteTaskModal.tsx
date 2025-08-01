import { DialogBox } from "@/components/DialogBox";
import { setIsDeleteTaskModalOpen } from "@/redux/slice/taskDataSlice";
import { RootState } from "@/redux/store";
import { deleteTask } from "@/services/api/jobTracker";
import { showToast } from "@/utils/alert";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { DeleteTaskModalProps, TaskData } from "./interfaces";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";

export function DeleteTaskModal({ goalsListRefetch }: DeleteTaskModalProps) {
  const dispatch = useDispatch();

  const taskData = useSelector((state: RootState) => {
    return state.taskDataReducers.taskData;
  }) as TaskData;

  const isDeleteTaskModalOpen = useSelector((state: RootState) => {
    return state.taskDataReducers.isDeleteTaskModalOpen;
  });

  function onDeleteTaskSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!taskData._id) return;
    const payload = [taskData._id];
    deleteTaskMutation.mutate(payload);
  }

  /*++++++++++++++ Tanstack Mutation For Deleting Task ++++++++++++++  */
  const deleteTaskMutation = useMutation({
    mutationFn: (payload: string[]) => deleteTask(payload),
    onSuccess: () => {
      showToast(MESSAGES.TASK_DELETED_SUCCESS, ALERT_TYPES.SUCCESS);
      dispatch(setIsDeleteTaskModalOpen(false));
      goalsListRefetch();
    },
    onError: () => {
      showToast(MESSAGES.TASK_DELETED_FAILURE, ALERT_TYPES.ERROR);
    },
  });

  const { isPending: isDeletingTaskPending } = deleteTaskMutation;

  return (
    <DialogBox
      onSubmit={onDeleteTaskSubmit}
      open={isDeleteTaskModalOpen}
      canInteractOutside={true}
      onOpenChange={(open) => dispatch(setIsDeleteTaskModalOpen(open))}
      title={"Are you sure?"}
      description="Do you want to delete this task?"
      submitBtnText="Confirm"
      isSubmitting={isDeletingTaskPending}
    />
  );
}
