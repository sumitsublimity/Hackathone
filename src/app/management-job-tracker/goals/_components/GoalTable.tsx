"use client";

import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { GoalTableProps } from "./interfaces";
import { TaskRowButtons } from "./TaskRowButtons";
import { TableLoader } from "@/components/TableLoader";

interface CellProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default function GoalTable({
  data,
  isDataLoading,
  columns,
}: GoalTableProps) {
  const [expanded, setExpanded] = React.useState({});

  const TableCell = ({ children, style }: CellProps) => {
    return (
      <td style={style} className="px-2 py-2 border border-lightTeal">
        {children}
      </td>
    );
  };

  const ExpandableTableCell = ({ children, className, style }: CellProps) => {
    return (
      <td
        style={style}
        className={`border border-lightTeal px-2 py-2 ${className}`}
      >
        {children}
      </td>
    );
  };

  const TableHeader = ({ children, style }: CellProps) => {
    return (
      <th
        style={style}
        className="px-2 py-2 font-medium border border-lightTeal text-center rounded-sm"
      >
        {children}
      </th>
    );
  };

  // @ts-ignore
  function expandRow(row) {
    // To check if row can expand:
    if (row.getCanExpand()) {
      // Call function to expand/collapse row:
      const functionToExpandRow = row.getToggleExpandedHandler();
      return functionToExpandRow();
    }
  }

  /*++++++++++++++ TanStack Table Configuration ++++++++++++++  */
  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getRowCanExpand: (row) => row.original.subGoals.length > 0,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    defaultColumn: {
      size: 200,
      minSize: 50,
      maxSize: 1000,
    },
  });

  return (
    <div className="overflow-x-auto scrollbar-thin touch-auto">
      <table className="w-full table-fixed border-collapse text-sm">
        {/* ++++++++++++++ Table Headers ++++++++++++++ */}
        <thead className="bg-offWhite text-slateGreen font-bold text-left">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHeader
                    key={header.id}
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHeader>
                );
              })}
            </tr>
          ))}
        </thead>

        {/* ++++++++++++++ Table Body ++++++++++++++ */}
        {isDataLoading ? (
          <tbody>
            <tr>
              <td colSpan={table.getVisibleFlatColumns().length}>
                <TableLoader />
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-slateGreen"
                >
                  No records found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                return (
                  <React.Fragment key={row.id}>
                    {/* ++++++++++++++ Main Goal Rows ++++++++++++++ */}
                    <tr
                      onClick={() => {
                        expandRow(row);
                      }}
                      className={`  border-lightTeal text-slateGreen font-medium hover:bg-gray-100 ${
                        row.getCanExpand()
                          ? "border border-lightTeal cursor-pointer"
                          : null
                      }`}
                    >
                      {/* Fills the cells with data: */}
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </tr>

                    {/* ++++++++++++++ Expanded Task Rows ++++++++++++++ */}
                    {row.getIsExpanded() &&
                      row.original.subGoals.map((task, i) => {
                        // Fills data if expandable row is expanded:
                        return (
                          <tr
                            key={`${row.id}-task-${i}`}
                            className={
                              "text-slateGreen italic border border-lightTeal pl-4"
                            }
                          >
                            <ExpandableTableCell />
                            <ExpandableTableCell className="pl-10 break-all">
                              {task.name}
                            </ExpandableTableCell>
                            <ExpandableTableCell className="text-center">
                              {task.occurrence}
                            </ExpandableTableCell>
                            <ExpandableTableCell className="text-center">
                              {task.period}
                            </ExpandableTableCell>

                            {/* Action button in expanded row: */}
                            <ExpandableTableCell>
                              <TaskRowButtons task={task} />
                            </ExpandableTableCell>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        )}
      </table>
    </div>
  );
}
