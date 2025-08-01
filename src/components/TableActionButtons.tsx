// Framework imports:
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
// Libraries imports:
import Button from "@/components/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
// Local imports:
import activeButton from "@/../public/icons/activeBtn.svg";
import inactiveButton from "@/../public/icons/not-allowed.svg";
import Edit from "@/../public//icons/table_action_edit.svg";
import Save from "@/../public//icons/table_action_save.svg";
import {
  SiteFormPayload,
  SiteTableCols,
  TableActionButtonsProps,
  UserData,
} from "@/utils/interface";
import { showToast } from "@/utils/alert";
import { toggleInactiveStaff } from "@/services/api/staff/staff";
import { toggleInactiveSite } from "@/services/api/site/site";

const TableActionButtons = (props: TableActionButtonsProps) => {
  const { data, activeDataRefetch, inactiveDataRefetch, usedFor } = props;

  const router = useRouter();
  const [isInactive, setIsInactive] = useState(data?.inActive);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  // This modifies a word in the modal message text:
  const statusLiteral = data.inActive ? "activate" : "deactivate";

  const handleGhostLogin = (data: UserData | SiteTableCols) => {
    alert(`Ghost Log in: ${data.firstName}`);
  };

  const handleEdit = (data: UserData | SiteTableCols) => {
    if (usedFor === "site") {
      router.push(`/site-management/add-site/${data._id}`);
    }
    if (usedFor === "staff") {
      router.push(`/staff-management/add-staff/${data._id}`);
    }
  };

  async function toggleInactive(data: UserData | SiteTableCols) {
    const updatedState = !isInactive;

    setIsInactive(updatedState);

    const payload = { inActive: updatedState };
    const id = data._id;
    const message = !isInactive ? "inactive" : "active";

    if (usedFor === "staff") {
      await toggleInactiveStaff(payload, id);
      showToast(`'${data.firstName}' is ${message} now`, "success");
    }
    if (usedFor === "site") {
      await toggleInactiveSite(payload, id);
      showToast(`'${data.firstName}' is ${message} now`, "success");
    }

    // Refetch latest data after toggle:
    activeDataRefetch();
    inactiveDataRefetch();
    setIsConfirmModalOpen(false);
  }

  return (
    <div className="flex justify-evenly items-center">
      {/*++++++++++++++ Ghost Login Button ++++++++++++++  */}
      <Button
        type="button"
        variant="default"
        icon={<Image src={Save} alt="Save" />}
        className="bg-transparent shadow-none hover:bg-transparent p-1"
        onClick={() => handleGhostLogin(data)}
        tooltip="Ghost Login"
      />
      {/*++++++++++++++ Staff Edit Button ++++++++++++++  */}
      <Button
        type="button"
        variant="default"
        icon={<Image src={Edit} alt="Edit" />}
        className="bg-transparent shadow-none hover:bg-transparent p-1"
        onClick={() => {
          handleEdit(data);
        }}
        tooltip="Edit Staff"
      />

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        {/*++++++++++++++ Active/Inactive Button ++++++++++++++  */}
        <DialogTrigger asChild>
          {isInactive ? (
            <Button
              type="button"
              variant="default"
              icon={
                <Image
                  src={activeButton}
                  alt="inactive icon"
                  height={24}
                  width={24}
                />
              }
              className="bg-transparent shadow-none hover:bg-transparent p-1"
              tooltip="Activate Staff"
            />
          ) : (
            <Button
              type="button"
              variant="default"
              icon={
                <Image
                  src={inactiveButton}
                  alt="Active icon"
                  height={24}
                  width={24}
                />
              }
              className="bg-transparent shadow-none hover:bg-transparent p-1"
              tooltip="Deactivate Staff"
            />
          )}
        </DialogTrigger>

        {/*++++++++++++++ Confirmation Modal For Active/Inactive ++++++++++++++  */}
        <DialogContent className="sm:max-w-[425px] w-full px-4 py-4 mx-auto sm:px-6 sm:py-6 border-none">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl text-darkGreen">
              Are you sure?
            </DialogTitle>
            <DialogDescription className="text-[var(--font-darkGray)]">
              {` Do you want to ${statusLiteral} this ${usedFor}?`}
            </DialogDescription>
          </DialogHeader>
          {/*++++++++++++++ Cancel & Submit Button ++++++++++++++  */}
          <DialogFooter className="flex flex-row justify-between sm:justify-between gap-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="default"
                text="Cancel"
                className="px-4 py-3 sm:px-5 sm:py-4 bg-peach hover:bg-peach text-white hover:brightness-90"
              />
            </DialogClose>
            <Button
              type="button"
              variant="default"
              text="Confirm"
              onClick={() => toggleInactive(data)}
              className="px-4 py-3 sm:px-5 sm:py-4 bg-darkGreen hover:bg-darkGreen text-white hover:brightness-120"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default TableActionButtons;
