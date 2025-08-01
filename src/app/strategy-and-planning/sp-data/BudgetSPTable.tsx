import React, { useState } from "react";
import Image from "next/image";
import Save from "@/../public/icons/save1.svg";
import Cross from "@/../public/icons/cross1.svg";
import EditIcon from "@/../public/icons/edit-row.svg";
import { TableLoader } from "@/components/TableLoader";
import { useGetSP, useUpdateSP } from "@/services/query/S&P-query/S&P.query";
import { months, SPHead } from "@/utils/constants";
import { ToolTipWrapper } from "@/app/management-job-tracker/goals/_components/ToolTipWrapper";
import { SPData, TSPRowEdit, UpdateSPRequest } from "@/utils/interface";
import { allowOnlyNumbers } from "@/utils/inputSanitizers";
import { formatEnglishNumber } from "@/utils/yearUtils";
import { useSyncLoading } from "@/hooks/useSyncLoading";

// Types


interface BudgetSPTableProps {
    onYearChange: string;
    changeSiteValue: string;
}

interface Head {
    id: number;
    name: string;
    value: string;
    editable: boolean;
}

// Key mapping for field access
const keyMap: Record<string, keyof SPData> = {
    totalHoursSold: "totalHoursSold",
    occupancy: "occupancy",
    kitchenMealsServed: "servedKitchenMeals",
    totalFoodSpend: "totalFoodSpend",
    costPerMeal: "costPerMeal",
    totalStaff: "totalStaff",
    totalStaffHours: "totalStaffHours",
    totalEnquiries: "totalEnquiries",
    showRounds: "showRounds",
    newStart: "newStart",
    accidentsReported: "accidentReported",
    completedTwoYearChecks: "completedTwoYearChecks",
};

// Editable fields mapping
const editableKeyMap: Record<string, keyof TSPRowEdit> = {
    kitchenMealsServed: "servedKitchenMeals",
    totalStaffHours: "totalStaffHours",
    accidentsReported: "accidentReported",
    completedTwoYearChecks: "completedTwoYearChecks",
};



const formatSPTableValue = (fieldKey: string, value: number): string => {
    if (fieldKey === "occupancy") {
        return `${value}%`;
    } else if (fieldKey === "totalFoodSpend" || fieldKey === "costPerMeal") {
        return `£${formatEnglishNumber(value)}`;
    } else {
        return value === null ? "-" : formatEnglishNumber(value);
    }
};

const BudgetSPTable: React.FC<BudgetSPTableProps> = ({ onYearChange, changeSiteValue }) => {
    const {
        data = [],
        isLoading,
        isError,
    } = useGetSP(onYearChange, changeSiteValue) as {
        data: SPData[],
        isLoading: boolean,
        isError: boolean
    };

    const { mutate: updateSP, isPending: isUpdateSPPending } = useUpdateSP();
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<TSPRowEdit | null>(null);

    const handleEditRow = (rowIndex: number, rowObj: SPData | undefined): void => {
        setEditingRow(rowIndex);
        if (!rowObj) {
            setEditingData({
                servedKitchenMeals: "",
                completedTwoYearChecks: "",
                accidentReported: "",
                totalStaffHours: "",
            });
            return;
        }
        setEditingData({
            servedKitchenMeals: rowObj.servedKitchenMeals?.toString(),
            completedTwoYearChecks: rowObj.completedTwoYearChecks?.toString(),
            accidentReported: rowObj.accidentReported?.toString(),
            totalStaffHours: rowObj.totalStaffHours?.toString(),
        });
    };

    const handleCancelEdit = (): void => {
        setEditingRow(null);
        setEditingData(null);
    };

    const handleInputChange = (key: keyof TSPRowEdit, value: string): void => {
        if (!editingData) return;
        setEditingData(prev => prev ? { ...prev, [key]: value } : null);
    };

    const handleSaveRow = (rowIndex: number): void => {
        if (!editingData) return;

        const rowObj = data.find((d: SPData) => d.month === months[rowIndex]);
        const output: UpdateSPRequest = {
            month: months[rowIndex],
            siteID: rowObj?.siteID || changeSiteValue,
            year: rowObj?.year || onYearChange,
            ...editingData,
        };

        updateSP(output);
        setEditingRow(null);
        setEditingData(null);
    };

    const getFieldValue = (rowObj: SPData | undefined, fieldKey: string): number => {
        if (!rowObj) return 0;
        const mappedKey = keyMap[fieldKey];

        if (fieldKey == "occupancy") {
            return rowObj.occupancy;
        }
        return mappedKey ? rowObj[mappedKey] as number : 0;
    };


    if (isError) {
        return (
            <div className="p-4 text-center text-red-500">
                Error loading data. Please try again.
            </div>
        );
    }

    useSyncLoading(isUpdateSPPending);

    return isLoading ? (
        <TableLoader />
    ) : (
        <>
            <div className="overflow-auto">
                <table className="table-auto border border-gray-300 w-full text-sm">
                    <thead className="bg-offWhite">
                        <tr>
                            <th className="p-2 font-medium text-sm border bg-offWhite border-lightTeal text-center text-slateGreen">
                                Month
                            </th>
                            {SPHead.map((item: Head, index: number) => (
                                <th
                                    key={index}
                                    className="p-2 font-medium text-sm border bg-offWhite border-lightTeal text-center text-slateGreen"
                                >
                                    {item.name}
                                </th>
                            ))}
                            <th className="p-2 font-medium text-sm border bg-offWhite border-lightTeal text-center text-slateGreen">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {months.map((month: string, rowIndex: number) => {
                            const rowObj = data.find((d: SPData) => d.month === month);
                            const isEditing = editingRow === rowIndex;

                            return (
                                <tr key={rowIndex} className="even:bg-gray-50">
                                    <td className="p-2 font-light text-sm border bg-white border-lightTeal text-center text-slateGreen">
                                        {month}
                                    </td>
                                    {SPHead.map((item: Head, index: number) => (
                                        <td
                                            key={index}
                                            className="p-2 font-light text-sm border bg-white border-lightTeal text-center text-slateGreen"
                                        >
                                            {isEditing && item.editable ? (
                                                <input
                                                    type="text"
                                                    value={
                                                        editingData?.[editableKeyMap[item.value] as keyof TSPRowEdit] || ""
                                                    }
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        const mappedKey = editableKeyMap[item.value] as keyof TSPRowEdit;
                                                        if (mappedKey) {
                                                            handleInputChange(mappedKey, e.target.value);
                                                        }
                                                    }}
                                                    onInput={allowOnlyNumbers}
                                                    maxLength={10}
                                                    className="w-20 px-2 py-1 text-center border-1 border-peachyPink rounded focus:outline-none text-peachyPink"
                                                    placeholder=""
                                                />
                                            ) : (
                                                <span>
                                                    {formatSPTableValue(item.value, getFieldValue(rowObj, item.value))}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                    <td className="p-2 font-light text-sm border border-lightTeal bg-white text-center">
                                        {isEditing ? (
                                            <div className="flex gap-2 justify-center">
                                                <ToolTipWrapper toolTipText="Save">
                                                    <button
                                                        onClick={() => handleSaveRow(rowIndex)}
                                                    >
                                                        <Image src={Save} alt="Save" />
                                                    </button>
                                                </ToolTipWrapper>
                                                <ToolTipWrapper toolTipText="Discard">
                                                    <button
                                                        onClick={handleCancelEdit}
                                                    >
                                                        <Image src={Cross} alt="Cancel" />
                                                    </button>
                                                </ToolTipWrapper>
                                            </div>
                                        ) : (
                                            <div className="flex gap-1 justify-center">
                                                <ToolTipWrapper toolTipText="Edit">
                                                    <button
                                                        onClick={() => handleEditRow(rowIndex, rowObj)}
                                                        className="text-black hover:underline text-xs px-2 py-1 rounded"
                                                    >
                                                        <Image src={EditIcon} alt="Edit" />
                                                    </button>
                                                </ToolTipWrapper>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );

};

export default BudgetSPTable;
