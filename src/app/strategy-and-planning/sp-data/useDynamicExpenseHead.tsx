import { useMemo } from "react";

export type ExpenseHeadType = {
    id: number;
    name: string;
    value: string;
    editable: boolean;
    divide: boolean;
};

export const ExpenseHead: ExpenseHeadType[] = [
    {
        id: 1,
        name: "Chef Salary",
        value: "chefSalary",
        editable: true,
        divide: false,
    },
    {
        id: 2,
        name: "Gas & Electric (1/{classRoom})",
        value: "Gas & Electric",
        editable: false,
        divide: true,
    },
    {
        id: 3,
        name: "Rent & Rates (1/{classRoom})",
        value: "Rent & Rates",
        editable: false,
        divide: true,
    },
    {
        id: 4,
        name: "Cleaning (1/{classRoom})",
        value: "Cleaning",
        editable: false,
        divide: true,
    },
    {
        id: 5,
        name: "Waste (1/{classRoom})",
        value: "Waste",
        editable: false,
        divide: true,
    },
    {
        id: 6,
        name: "Total Food",
        value: "food",
        editable: true,
        divide: false,
    },
    {
        id: 7,
        name: "Total",
        value: "total",
        editable: false,
        divide: false,
    },
];
export function useDynamicExpenseHead(classRoom: string | number) {
    return useMemo(() =>
        ExpenseHead.map((head) => ({
            ...head,
            name: head.name.replace("{classRoom}", String(classRoom || 1)),
        })), [classRoom]);
}