import editTaskIcon from "@/../public/icons/edit-row.svg";
import deleteTaskIcon from "@/../public/icons/delete-row.svg";
import { ToolTipWrapper } from "./ToolTipWrapper";
import { subGoals } from "./interfaces";
import Image from "next/image";
import { useDispatch } from "react-redux";
import {
  fetchTaskData,
  setIsDeleteTaskModalOpen,
  setIsEditTaskModalOpen,
} from "@/redux/slice/taskDataSlice";

export const TaskRowButtons = ({ task }: { task: subGoals }) => {
  const dispatch = useDispatch();
  return (
    <div className="flex gap-4 justify-start">
      <ToolTipWrapper toolTipText="Edit Task">
        <button
          className="cursor-pointer hover:brightness-150"
          onClick={(e) => {
            dispatch(fetchTaskData(task));
            dispatch(setIsEditTaskModalOpen(true));
          }}
        >
          <Image src={editTaskIcon} alt="Edit task icon." />
        </button>
      </ToolTipWrapper>
      <ToolTipWrapper toolTipText="Delete Task">
        <button
          className="cursor-pointer hover:brightness-70"
          onClick={(e) => {
            dispatch(fetchTaskData(task));
            dispatch(setIsDeleteTaskModalOpen(true));
          }}
        >
          <Image src={deleteTaskIcon} alt="Delete task icon." />
        </button>
      </ToolTipWrapper>
    </div>
  );
};
