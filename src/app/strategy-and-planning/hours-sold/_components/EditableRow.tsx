import { useState, useEffect } from "react";
import Save from "@/../public/icons/save1.svg";
import Image from "next/image";
import Cross from "@/../public/icons/cross1.svg";
import EditIcon from "@/../public/icons/edit-row.svg";
import Delete from "@/../public/icons/delete-row.svg";
import { allowOnlyNumbers } from "@/utils/inputSanitizers";
import {
  useDeleteHoursSold,
  useUpdateHoursSold,
} from "@/services/query/hours-sold-query/hours-sold-query";
import { DialogBox } from "@/components/DialogBox";
import { ToolTipWrapper } from "@/app/management-job-tracker/goals/_components/ToolTipWrapper";
import { useLoading } from "@/app/LoadingContext";
import { useSyncLoading } from "@/hooks/useSyncLoading";

export const EditableRow = ({
  rowData,
  rowIndex,
  editingIndex,
  changeSiteId,
  data,
  item,
  onEditChange,
}: {
  rowData: any;
  rowIndex: number;
  editingIndex: number | null;
  changeSiteId: string;
  data: any;
  item: any;
  onEditChange: (index: number | null) => void;
}) => {
  const { setIsLoading } = useLoading();

  const isEditing = editingIndex === rowIndex;
  const [editRow, setEditRow] = useState({ ...rowData });
  const [isAddHoursSoldModalOpen, setIsAddHoursSoldModalOpen] = useState(false);

  const { isPending: loadingSaveHours, mutate: updateHourSold } =
    useUpdateHoursSold();
  const { isPending: isDeleteHoursSold, mutate: deleteHourSold } =
    useDeleteHoursSold();

  // show loader
  useSyncLoading(loadingSaveHours, isDeleteHoursSold);

  useEffect(() => {
    if (!isEditing) {
      setEditRow({ ...rowData });
    }
  }, [isEditing, rowData]);

  const handleChange = (key: string | number, value: string) => {
    if (typeof key === "string") {
      // for name
      setEditRow((prev: any) => ({ ...prev, [key]: value }));
    } else {
      // for weeks
      setEditRow((prev: any) => {
        const updatedWeeks = [...prev.weeks];
        updatedWeeks[key] = {
          ...updatedWeeks[key],
          totalHours: value,
        };
        return { ...prev, weeks: updatedWeeks };
      });
    }
  };

  const handleSave = () => {
    const modifiedData = {
      year: +data.year,
      month: data.month,
      name: editRow.name,
      ...editRow,
      ageGroup: item._id,
      siteID: changeSiteId,
    };
    updateHourSold({ id: rowData._id, payload: modifiedData });

    onEditChange(null);
  };

  const handleCancel = () => {
    setEditRow({ ...rowData });
    onEditChange(null);
  };

  useEffect(() => {
    onEditChange(null);
  }, [data]);

  function handleDialogOpenChange(isOpen: boolean) {
    setIsAddHoursSoldModalOpen(isOpen);
  }

  const inputClass =
    "w-full px-2 py-1 border border-peachyPink rounded text-center focus:outline-none";

  return (
    <tr className={isEditing ? "bg-peachyPink" : ""}>
      <td className="p-2 text-sm border bg-white border-lightTeal text-center text-slateGreen text-wrap">
        {isEditing ? (
          <input
            type="text"
            value={editRow.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={inputClass}
          />
        ) : (
          rowData.name
        )}
      </td>
      {rowData.weeks.map((key: any, index: any) => (
        <td
          key={index}
          className="p-2 text-sm border bg-white border-lightTeal text-center text-slateGreen"
        >
          {isEditing ? (
            <input
              type="text"
              value={editRow.weeks[index]?.totalHours}
              onChange={(e) => handleChange(index, e.target.value)}
              className={inputClass}
              onInput={allowOnlyNumbers}
              maxLength={3}
            />
          ) : key.totalHours == "" ? (
            "-"
          ) : (
            key.totalHours
          )}
        </td>
      ))}

      <td className="p-2 text-sm border bg-white border-lightTeal text-center ">
        <div className="flex items-center justify-center gap-3">
          {isEditing ? (
            <>
              <button onClick={handleSave}>
                <ToolTipWrapper toolTipText="Save">
                  <Image src={Save} alt="Save" />
                </ToolTipWrapper>
              </button>
              <button onClick={handleCancel}>
                <ToolTipWrapper toolTipText="Discard">
                  <Image src={Cross} alt="Cancel" />
                </ToolTipWrapper>
              </button>
            </>
          ) : (
            <button onClick={() => onEditChange(rowIndex)}>
              <ToolTipWrapper toolTipText="Edit">
                <Image src={EditIcon} alt="Edit" />
              </ToolTipWrapper>
            </button>
          )}
          <DialogBox
            onSubmit={(e) => {
              e.preventDefault();
              deleteHourSold({ id: rowData._id });
              setIsAddHoursSoldModalOpen(false);
            }}
            open={isAddHoursSoldModalOpen}
            onOpenChange={handleDialogOpenChange}
            title={"Are you sure?"}
            modal={true}
            isSubmitting={false}
            triggerButton={
              <div className="h-full">
                <ToolTipWrapper toolTipText="Delete">
                  <Image src={Delete} alt="delete" />
                </ToolTipWrapper>
              </div>
            }
            submitBtnText="Confirm"
            contentClassName="sm:max-w-[425px]"
            description={"Do you want to delete Hours Sold data?"}
            formFields={<></>}
          />
        </div>
      </td>
    </tr>
  );
};
