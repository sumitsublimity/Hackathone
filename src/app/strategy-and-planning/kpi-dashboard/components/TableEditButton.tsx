import { ToolTipWrapper } from "@/app/management-job-tracker/goals/_components/ToolTipWrapper";
import { ADD_EDIT_ICON } from "@/utils/constants";
import Image from "next/image";

interface TableEditButtonProps {
  onClickHandler: () => void;
  toolTipText: string;
}
export function TableEditButton(props: TableEditButtonProps) {
  const { onClickHandler, toolTipText } = props;
  return (
    <div className="w-full flex flex-row justify-end my-1">
      <button
        className="sticky right-0 cursor-pointer"
        onClick={onClickHandler}
      >
        <ToolTipWrapper toolTipText={toolTipText}>
          <Image src={ADD_EDIT_ICON} alt="Edit icon" height={17} width={17} />
        </ToolTipWrapper>
      </button>
    </div>
  );
}
