"use client";
import React from "react";
import { TableLoader } from "./TableLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TableProps<T> = {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  bgHeader?: string;
  totalRow?: any;
};

const TableComp = <T extends object>({
  data,
  columns,
  bgHeader = "bg-offWhite",
  totalRow,
}: TableProps<T>) => {
  const isDataLoading = useSelector((state: RootState) => {
    return state.dataLoadingReducers.isDataLoading;
  });

  const table = useReactTable({
    data,
    columns,
    state: {},
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      size: 200,
      minSize: 50,
      maxSize: 1000,
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-t border-l border-lightTeal overflow-x-auto">
        <Table className="table-fixed w-full">
          <TableHeader className="text-[var(--font-darkGray)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className={`p-2 font-medium text-sm border-r border-b border-lightTeal text-center text-slateGreen break-words whitespace-normal ${bgHeader}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {isDataLoading ? (
            <TableBody>
              <tr>
                <td
                  className="border border-lightTeal"
                  colSpan={columns.length}
                >
                  <div className="w-[calc(100vw-96px)] lg:w-[calc(100vw-371px)] sticky left-0">
                    <TableLoader />
                  </div>
                </td>
              </tr>
            </TableBody>
          ) : (
            <TableBody>
              {data.length === 0 ? (
                <tr className="text-center">
                  <td
                    className="border border-lightTeal py-5"
                    colSpan={columns.length}
                  >
                    <div className="w-[calc(100vw-96px)] lg:w-[calc(100vw-371px)] sticky left-0">
                      No records found
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-t border-[var(--table-border-bg)]"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className="px-2 py-0 text-sm font-normal text-slateGreen border-r border-b border-lightTeal break-words whitespace-normal"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                  {/* ✅ Total Row */}
                  {totalRow && (
                    <TableRow className="bg-muted border-t border-[var(--table-border-bg)] font-semibold">
                      {columns.map((col: any, index) => {
                        const key = col.accessorKey;
                        return (
                          <TableCell
                            key={index}
                            style={{ width: col.size }}
                            className="px-2 py-2 text-sm text-center text-slateGreen border-r border-b border-lightTeal whitespace-nowrap"
                          >
                            {key === "name" ? "Total" : (totalRow?.[key] ?? "")}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  );
};

export default TableComp;
