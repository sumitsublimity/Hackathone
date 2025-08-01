import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TableLoader } from "./TableLoader";

interface DialogBoxProps {
  triggerButton?: React.ReactNode;
  title: string;
  modal?: boolean;
  description?: string;
  formFields?: React.ReactNode;
  open: boolean;
  canInteractOutside?: boolean;
  onOpenChange: (open: boolean) => void;
  formReset?: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submitBtnText?: string;
  contentClassName?: string;
  isSubmitting: boolean;
}
export function DialogBox({
  triggerButton,
  title,
  formReset,
  description,
  formFields,
  open,
  onOpenChange,
  onSubmit,
  canInteractOutside = false,
  modal = true,
  submitBtnText = "Submit",
  isSubmitting,
  contentClassName = "sm:max-w-[425px]",
}: DialogBoxProps) {
  return (
    <Dialog
      modal={modal}
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) formReset?.();
        onOpenChange(isOpen);
      }}
    >
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          if (!canInteractOutside) e.preventDefault();
        }}
        className={`${contentClassName} border-none `}
      >
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="text-darkGreen text-2xl">
              {title}
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          {isSubmitting ? <TableLoader /> : formFields}
          <DialogFooter className="mt-5 w-full flex flex-row justify-between sm:justify-between">
            <DialogClose asChild>
              <Button
                onClick={() => {
                  formReset?.();
                  onOpenChange(false);
                }}
                variant="default"
                className="bg-peach cursor-pointer hover:bg-peach hover:brightness-90"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-darkGreen cursor-pointer hover:bg-darkGreen hover:brightness-120"
            >
              {submitBtnText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
