import { DialogBox } from "@/components/DialogBox";
import { showToast } from "@/utils/alert";
import { useMutation } from "@tanstack/react-query";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import { DeleteEnquiryProps } from "@/utils/interface";
import { deleteEnquiry } from "@/services/api/strategyAndPlanning/enquiries";

export function DeleteEnquiryModal({
  row,
  isDeleteEnquiryModalOpen,
  setIsDeleteEnquiryModalOpen,
  enquiryListRefetch,
}: DeleteEnquiryProps) {
  /*++++++++++++++ Tanstack Mutation For Deleting Enquiry ++++++++++++++  */
  const deleteEnquiryMutation = useMutation({
    mutationFn: (payload: string[]) => deleteEnquiry(payload),
    onSuccess: () => {
      showToast(MESSAGES.ENQUIRY_DELETED_SUCCESS, ALERT_TYPES.SUCCESS);
      setIsDeleteEnquiryModalOpen(false);
      enquiryListRefetch();
    },
    onError: (error) => {
      console.error("Failed to delete enquiry", error);
    },
  });

  const { isPending: isDeleteEnquiryPending } = deleteEnquiryMutation;

  function onDeleteEnquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!row?.original?.id) {
      console.error("Invalid enquiry. Cannot delete");
      return;
    }
    const payload = [row?.original?.id];
    deleteEnquiryMutation.mutate(payload);
  }

  return (
    <DialogBox
      onSubmit={onDeleteEnquirySubmit}
      open={isDeleteEnquiryModalOpen}
      onOpenChange={setIsDeleteEnquiryModalOpen}
      canInteractOutside={true}
      title="Are you sure?"
      description="Do you want to delete this enquiry?"
      submitBtnText="Confirm"
      isSubmitting={isDeleteEnquiryPending}
    />
  );
}
