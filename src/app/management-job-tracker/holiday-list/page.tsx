"use client";
// Framework imports:
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
// Libraries imports:
import { ColumnDef, Row } from "@tanstack/react-table";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
// Local imports:
import InputField from "@/components/InputField";
import CrossIcon from "@/../public/icons/cross.svg";
import DropdownField from "@/components/DropdownField";
import TableComp from "@/components/Table";
import Pagination from "@/components/Pagination";
import { ENTRIES_OPTIONS, monthOptions } from "../goals/_components/constants";
import {
  FilterParams,
  HolidayTableCols,
} from "../goals/_components/interfaces";
import { ToolTipWrapper } from "../goals/_components/ToolTipWrapper";
import deleteHolidayIcon from "@/../public/icons/delete-row.svg";
import editIcon from "@/../public/icons/edit-row.svg";
import { getHolidayList } from "@/services/api/jobTracker";
import { fetchDataLoadingState } from "@/redux/slice/dataLoadingSlice";
import { AddHolidayModal } from "./_components/AddHolidayModal";
import Button from "@/components/Button";
import { DeleteHolidayModal } from "./_components/DeleteHolidayModal";
import { EditHolidayModal } from "./_components/EditHolidayModal";
import { getFiveYearOptions } from "@/utils/yearUtils";

function Page() {
  const dispatch = useDispatch();
  const currentMonth = new Date().getMonth().toString();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [searchInput, setSearchInput] = useState("");
  const [rowData, setRowData] = useState<Row<HolidayTableCols> | null>(null);
  const [addHolidayModalOpen, setAddHolidayModalOpen] = useState(false);
  const [isEditHolidayModalOpen, setIsEditHolidayModalOpen] = useState(false);
  const [isDeleteHolidayModalOpen, setIsDeleteHolidayModalOpen] =
    useState(false);
  // Memoized to prevent calculation on every render:
  const { yearOptions, currentYear } = useMemo(() => getFiveYearOptions(), []);
  const currentMonthDateRange = getMonthDateRange(currentMonth, currentYear);
  const [holidayFilterParams, setHolidayFilterParams] = useState<FilterParams>({
    page: 0,
    size: 10,
    searchFilters: [
      {
        columnName: "year",
        columnType: "STRING",
        columnValue: currentYear,
        operation: "EQUAL_TO",
      },
      {
        columnName: "name",
        columnType: "STRING",
        columnValue: "",
        operation: "MATCH_TO",
      },
      {
        columnName: "date",
        columnType: "DATE",
        columnValue: currentMonthDateRange,
        operation: "IS_BETWEEN",
      },
    ],
    sortRules: [
      {
        columnName: "date",
        operation: "ASC",
      },
    ],
  });

  function updateSearchFilter(colName: string, value: string) {
    setHolidayFilterParams((prevParams) => {
      // Manipulate only columnValue for a columnName:
      const updatedSearchFilter = prevParams.searchFilters.map((filter) => {
        // Select the element from searchFilters and update:
        if (filter.columnName === colName) {
          return { ...filter, columnValue: value };
        } else {
          return filter;
        }
      });
      // Update holiday params with page set to default on every filter change.
      return {
        ...prevParams,
        searchFilters: updatedSearchFilter,
        page: 0,
      };
    });
  }

  function getSelectedYear() {
    const yearObject = holidayFilterParams.searchFilters.find((f) => {
      return f.columnName === "year";
    });
    return yearObject?.columnValue;
  }

  function getMonthDateRange(
    month: number | string,
    year: number | string,
  ): string {
    const selectedMonth =
      typeof month === "string" ? parseInt(month, 10) : month;
    const selectedYear = typeof year === "string" ? parseInt(year, 10) : year;

    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(selectedYear, selectedMonth + 1, 0);

    return `${format(startDate, "yyyy-MM-dd")}#${format(endDate, "yyyy-MM-dd")}`;
  }

  /*++++++++++++++ Tanstack Query To Fetch Holiday List: ++++++++++++++  */
  const {
    data: holidayListData,
    refetch: refetchHolidayList,
    isLoading: isHolidayListLoading,
  } = useQuery({
    queryKey: ["getHolidayList", holidayFilterParams],
    queryFn: () => {
      return getHolidayList(holidayFilterParams);
    },
    retry: false,
  });

  /*++++++++++++++ Column Headers for Tanstack Table: ++++++++++++++  */
  const columns: ColumnDef<HolidayTableCols>[] = [
    {
      header: "S.NO",
      size: 50,
      cell: ({ row }) => {
        // Generate 1-based serial number for paginated rows:
        const sno =
          holidayFilterParams.page * holidayFilterParams.size + row.index + 1;
        return <div className="text-center">{sno}</div>;
      },
    },
    {
      accessorKey: "date",
      size: 200,
      header: "Date",
      cell: (info) => {
        const rawDate = info.getValue() as string;
        const date = new Date(rawDate);
        return format(date, "dd MMMM yyyy, EEEE");
      },
    },
    {
      accessorKey: "name",
      size: 400,
      header: "Name of Holiday",
      cell: (info) => {
        return info.getValue();
      },
    },
    {
      header: "Actions",
      size: 75,
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex flex-row justify-evenly py-3">
            <ToolTipWrapper toolTipText="Edit Holiday">
              <button
                className="cursor-pointer hover:brightness-150"
                aria-label="Edit Holiday"
                onClick={(e) => {
                  setRowData(row);
                  setIsEditHolidayModalOpen(true);
                }}
              >
                <Image src={editIcon} alt="Edit icon." />
              </button>
            </ToolTipWrapper>
            <ToolTipWrapper toolTipText="Delete Holiday">
              <button
                className="cursor-pointer hover:brightness-70"
                aria-label="Delete Holiday"
                onClick={(e) => {
                  setRowData(row);
                  setIsDeleteHolidayModalOpen(true);
                }}
              >
                <Image src={deleteHolidayIcon} alt="Delete icon." />
              </button>
            </ToolTipWrapper>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    // Debounced search:
    const timeoutId = setTimeout(() => {
      updateSearchFilter("name", searchInput.trim());
    }, 300);
    // Clean up function:
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    dispatch(fetchDataLoadingState(isHolidayListLoading));
  }, [isHolidayListLoading]);

  return (
    <main className="bg-offWhite min-h-[calc(100vh-72px)] p-6 overflow-auto">
      <article className="bg-white w-full min-h-[calc(100vh-120px)] rounded-2xl p-6 flex flex-col">
        <section className="flex flex-row justify-between items-center">
          {/* +++++++++ Section Title +++++++++ */}
          <section>
            <h1 className="text-lg text-darkGreen font-semibold">
              Holiday List
            </h1>
          </section>

          {/* +++++++++ Section: Holiday Filters +++++++++ */}
          <section className="flex flex-row gap-5">
            {/* +++++++++ Search Bar +++++++++ */}
            <div className="min-w-64">
              <InputField
                type="text"
                name="search"
                value={searchInput}
                icon="/icons/Search.svg"
                placeholder="Search..."
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
                iconRight={
                  searchInput && (
                    <button
                      className="cursor-pointer"
                      onClick={() => {
                        setSearchInput("");
                        updateSearchFilter("name", "");
                      }}
                    >
                      <Image src={CrossIcon} alt="clear search query" />
                    </button>
                  )
                }
              />
            </div>
            {/* +++++++++ Month Dropdown +++++++++ */}
            <div className="min-w-28">
              <DropdownField
                name="month"
                contentClassName="min-w-28"
                value={selectedMonth}
                options={monthOptions}
                placeholder="Month"
                onChange={(name, value) => {
                  setSelectedMonth(value);
                  const selectedYear = getSelectedYear() || currentYear;
                  const dateRangeValue = getMonthDateRange(value, selectedYear);
                  updateSearchFilter("date", dateRangeValue);
                }}
              />
            </div>

            {/* +++++++++ Year Dropdown +++++++++ */}
            <div className="min-w-28">
              <DropdownField
                name="year"
                contentClassName="min-w-28"
                value={getSelectedYear() || currentYear}
                options={yearOptions}
                placeholder="Year"
                iconRight="/icons/calendar.svg"
                onChange={(name, value) => {
                  updateSearchFilter("year", value);
                  const dateRangeValue = getMonthDateRange(
                    selectedMonth,
                    value,
                  );

                  updateSearchFilter("date", dateRangeValue);
                }}
              />
            </div>
            <div>
              <Button
                text="Add Holiday"
                onClick={() => {
                  setAddHolidayModalOpen(true);
                }}
                className="bg-slateGreen hover:bg-slateGreen hover:brightness-90 px-4 py-3 h-12"
              />
            </div>
          </section>
        </section>
        <hr className="border-lightTeal my-4 w-full" />

        {/* +++++++++ Holiday Table +++++++++ */}
        <section>
          <TableComp data={holidayListData?.data || []} columns={columns} />
        </section>

        {/*++++++++++++++ Pagination for Holiday Table ++++++++++++++  */}
        <section className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2 items-center mt-6">
            <span className="text-darkGreen">Rows</span>
            <div className="min-w-20">
              <DropdownField
                className="min-w-20"
                contentClassName="min-w-20"
                name="size"
                value={String(holidayFilterParams.size)}
                options={ENTRIES_OPTIONS}
                onChange={(name, value) => {
                  setHolidayFilterParams((prev) => {
                    return {
                      ...prev,
                      page: 0,
                      size: Number(value),
                    };
                  });
                }}
              />
            </div>
          </div>
          <Pagination
            pageIndex={holidayFilterParams.page}
            totalPages={holidayListData?.totalPages}
            onPageChange={(newPage) => {
              setHolidayFilterParams((prevFilter) => {
                return { ...prevFilter, page: newPage };
              });
            }}
          />
        </section>

        {/*++++++++++++++ Add Holiday Modal ++++++++++++++  */}
        <AddHolidayModal
          addHolidayModalOpen={addHolidayModalOpen}
          setAddHolidayModalOpen={setAddHolidayModalOpen}
          refetchHolidayList={refetchHolidayList}
        />

        {/*++++++++++++++ Delete Holiday Modal ++++++++++++++  */}
        {rowData && (
          <>
            <DeleteHolidayModal
              row={rowData}
              refetchHolidayList={refetchHolidayList}
              isDeleteHolidayModalOpen={isDeleteHolidayModalOpen}
              setIsDeleteHolidayModalOpen={setIsDeleteHolidayModalOpen}
            />

            <EditHolidayModal
              row={rowData}
              isEditHolidayModalOpen={isEditHolidayModalOpen}
              setIsEditHolidayModalOpen={setIsEditHolidayModalOpen}
              refetchHolidayList={refetchHolidayList}
            />
          </>
        )}
      </article>
    </main>
  );
}
export default Page;
