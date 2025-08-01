import { DialogBox } from "@/components/DialogBox";

import { deleteGoal } from "@/services/api/jobTracker";
import { showToast } from "@/utils/alert";
import { useMutation } from "@tanstack/react-query";
import { DeleteGoalModalProps } from "./interfaces";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";

export function DeleteGoalModal({
  row,
  isDeleteGoalModalOpen,
  setIsDeleteGoalModalOpen,
  goalsListRefetch,
}: DeleteGoalModalProps) {
  /*++++++++++++++ Tanstack Mutation For Deleting Goal ++++++++++++++  */
  const deleteGoalMutation = useMutation({
    mutationFn: (payload: string[]) => deleteGoal(payload),
    onSuccess: () => {
      showToast(MESSAGES.GOAL_DELETED_SUCCESS, ALERT_TYPES.SUCCESS);
      setIsDeleteGoalModalOpen(false);
      goalsListRefetch();
    },
    onError: () => {
      showToast(MESSAGES.GOAL_DELETED_FAILURE, ALERT_TYPES.ERROR);
    },
  });

  const { isPending: isDeletingGoalPending } = deleteGoalMutation;

  function onDeleteGoalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!row?.original?._id) return;
    const payload = [row?.original?._id];
    deleteGoalMutation.mutate(payload);
  }

  return (
    <DialogBox
      onSubmit={onDeleteGoalSubmit}
      open={isDeleteGoalModalOpen}
      onOpenChange={setIsDeleteGoalModalOpen}
      canInteractOutside={true}
      title={"Are you sure?"}
      description="Do you want to delete this goal?"
      submitBtnText="Confirm"
      isSubmitting={isDeletingGoalPending}
    />
  );
}
