import { ColumnDef } from "@tanstack/react-table";
import { StaffRow } from "../types/types";

export const staffHoursColumns: ColumnDef<StaffRow>[] = [
  {
    accessorKey: "staff",
    size: 120,
    header: "Staff",
    cell: (info) => {
      return <div className="text-center p-2">{info.getValue() as string}</div>;
    },
  },
  {
    accessorKey: "children",
    header: "Children",
    size: 150,
    cell: (info) => {
      return <div className="text-center p-2">{info.getValue() as number}</div>;
    },
  },
  {
    accessorKey: "hoursPerDay",
    header: "Hours/Day",
    size: 150,
    cell: (info) => {
      return <div className="text-center p-2">{info.getValue() as string}</div>;
    },
  },
  {
    accessorKey: "totalHours",
    header: "Total Hours",
    size: 150,
    cell: (info) => {
      return <div className="text-center p-2">{info.getValue() as number}</div>;
    },
  },
  {
    accessorKey: "weeklyHours",
    header: "Weekly Hours",
    size: 150,
    cell: (info) => {
      return <div className="text-center p-2">{info.getValue() as number}</div>;
    },
  },
];
