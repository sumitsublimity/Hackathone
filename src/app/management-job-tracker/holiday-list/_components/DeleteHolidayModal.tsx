import { DialogBox } from "@/components/DialogBox";
import { deleteGoal, deleteHoliday } from "@/services/api/jobTracker";
import { showToast } from "@/utils/alert";
import { useMutation } from "@tanstack/react-query";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import { Row } from "@tanstack/react-table";
import { HolidayTableCols } from "../../goals/_components/interfaces";

export interface DeleteHolidayModalProps {
  row: Row<HolidayTableCols>;
  isDeleteHolidayModalOpen: boolean;
  refetchHolidayList: () => void;
  setIsDeleteHolidayModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteHolidayModal({
  row,
  refetchHolidayList,
  isDeleteHolidayModalOpen,
  setIsDeleteHolidayModalOpen,
}: DeleteHolidayModalProps) {
  /*++++++++++++++ Tanstack Mutation For Deleting Goal ++++++++++++++  */
  const deleteHolidayMutation = useMutation({
    mutationFn: (payload: string[]) => deleteHoliday(payload),
    onSuccess: () => {
      showToast(MESSAGES.HOLIDAY_DELETED_SUCCESS, ALERT_TYPES.SUCCESS);
      setIsDeleteHolidayModalOpen(false);
      refetchHolidayList();
    },
    onError: () => {
      showToast(MESSAGES.HOLIDAY_DELETED_FAILURE, ALERT_TYPES.ERROR);
    },
  });

  const { isPending: isDeletingHolidayPending } = deleteHolidayMutation;

  function onDeleteHolidaySubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!row?.original?._id) {
      console.warn("Holiday ID missing, aborting delete.");
      return;
    }

    const holidayIdPayload = [row?.original?._id];
    deleteHolidayMutation.mutate(holidayIdPayload);
  }

  return (
    <DialogBox
      onSubmit={onDeleteHolidaySubmit}
      open={isDeleteHolidayModalOpen}
      onOpenChange={setIsDeleteHolidayModalOpen}
      canInteractOutside={true}
      title={"Are you sure?"}
      description="Do you want to delete this holiday?"
      submitBtnText="Confirm"
      isSubmitting={isDeletingHolidayPending}
    />
  );
}
