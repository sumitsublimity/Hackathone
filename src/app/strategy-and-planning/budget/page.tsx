"use client";

import Cross from "@/../public/icons/cross1.svg";
import EditIcon from "@/../public/icons/edit-row.svg";
import ExportIcon from "@/../public/icons/export.svg";
import Reset from "@/../public/icons/reset.svg";
import Save from "@/../public/icons/save1.svg";
import Button from "@/components/Button";
import DropdownField from "@/components/DropdownField";
import PageHeader from "@/components/PageHeader";
import {
  useEnquiryHead,
  useGetBudget,
  useImportBudgetCsv,
  useUpdateBudget,
} from "@/services/query/budget-review-query/budget.query";
import { months } from "@/utils/constants";
import { formatEnglishNumber, getFiveYearOptions } from "@/utils/yearUtils";

import { useLoading } from "@/app/LoadingContext";
import { TableLoader } from "@/components/TableLoader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchSiteDropdownOptions } from "@/services/api/site/fetchSiteDropdownOptions";
import Image from "next/image";

import { ToolTipWrapper } from "@/app/management-job-tracker/goals/_components/ToolTipWrapper";
import ImportDialog from "@/components/ui/ImportModal";
import { UrlConfig } from "@/services/ApiEndPoints";
import { useExportCSV } from "@/services/hook/useExportCSV";
import { allowOnlyNumbers } from "@/utils/inputSanitizers";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSyncLoading } from "@/hooks/useSyncLoading";

type THead = {
  id: string;
  name: string;
};

type BudgetItem = {
  head: string;
  year: number;
  budgetAmount: number;
};

type MonthlyEntry = {
  month: string;
  data: BudgetItem[];
};

type Totals = Record<string, { actual: number; budget: number }>;

type RowEditData = {
  [headId: string]: {
    actual: string | number;
    budget: string | number;
  };
};
type SiteOption = { value: string; label: string }; // Adjust to your actual site option structure

const Page = () => {
  const { yearOptions, currentYear } = useMemo(() => getFiveYearOptions(), []);
  const [onYearChange, setOnYearChange] = useState(currentYear);
  const { setIsLoading } = useLoading();

  const {
    data: heads,
    isPending: headIsloading,
    mutate: getQueryHead,
  } = useEnquiryHead();

  const { mutate: importBudgetCsv, isPending: importBudgetCsvPending } = useImportBudgetCsv();

  const { isPending, mutate: addEditBudget } = useUpdateBudget();
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [rowEditData, setRowEditData] = useState<RowEditData>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [siteOption, setSiteOption] = useState<SiteOption[]>([]);
  const [changeSiteValue, setChangeSiteValue] = useState("");
  const [siteLoading, setSiteLoading] = useState(false);

  const {
    data = [],
    isLoading,
    isError,
  } = useGetBudget(onYearChange, changeSiteValue);

  const { exportCSV } = useExportCSV();
  const headNames =
    heads?.map((d: THead) => ({ name: d.name, id: d.id })) || [];

  useEffect(() => {
    getQueryHead();
    const fetchData = async () => {
      try {
        setSiteLoading(true);
        const site = await fetchSiteDropdownOptions();
        setSiteOption(site);
        setChangeSiteValue(site[0]?.value);
      } catch (error) {
        console.error(error);
      } finally {
        setSiteLoading(false);
      }
    };
    fetchData();
  }, [getQueryHead]);

  useEffect(() => {
    setEditingRow(null);
  }, [onYearChange]);

  const handleEditRow = (rowIndex: number, monthEntry: MonthlyEntry) => {
    const editData: RowEditData = {};
    headNames.forEach((head: THead) => {
      const actual = monthEntry.data.find(
        (item: BudgetItem) => item.head === head.id && item.year === +onYearChange - 1,
      );
      const budget = monthEntry.data.find(
        (item: BudgetItem) => item.head === head.id && item.year === +onYearChange,
      );
      editData[head.id] = {
        actual: actual?.budgetAmount ?? "",
        budget: budget?.budgetAmount ?? "",
      };
    });
    setEditingRow(rowIndex);
    setRowEditData(editData);
  };
  const handleCancelEdit = () => {
    setEditingRow(null);
    setRowEditData({});
  };

  const handleSaveRow = async (rowIndex: number) => {
    try {
      const month = months[rowIndex];
      const saveData = transformToSaveFormat(
        rowEditData,
        month,
        +onYearChange,
        changeSiteValue,
      );
      // Call your API or mutation here with saveData
      addEditBudget(saveData);
      setEditingRow(null);
      setRowEditData({});
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };


  const handleDropdownChange = (name: string, value: string) => {
    setChangeSiteValue(value);
  };

  const resetFilers = () => {
    setChangeSiteValue(siteOption[0]?.value);
    setOnYearChange(currentYear);
    setEditingRow(null);
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolledRight, setScrolledRight] = useState(false);

  const toggleScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrolledRight ? 0 : scrollRef.current.scrollWidth,
        behavior: "smooth",
      });
      setScrolledRight(!scrolledRight);
    }
  };

  const transformToSaveFormat = (
    rowEditData: RowEditData,
    month: string,
    year: number,
    siteID: string,
  ): { month: string; siteID: string; data: BudgetItem[] } => {
    const result: BudgetItem[] = [];
    Object.entries(rowEditData).forEach(([head, values]) => {
      if (values.actual !== "" && values.actual !== undefined) {
        result.push({
          head,
          year: year - 1,
          budgetAmount: parseFloat(values.actual as string) || 0,
        });
      }
      if (values.budget !== "" && values.budget !== undefined) {
        result.push({
          head,
          year: year,
          budgetAmount: parseFloat(values.budget as string) || 0,
        });
      }
    });
    return {
      month,
      siteID,
      data: result,
    };
  };

  // Calculate totals for each head
  const totals: Totals = {};
  headNames.forEach((head: THead) => {
    totals[head.id] = { actual: 0, budget: 0 };
  });
  months.forEach((month: string) => {
    const monthEntry: MonthlyEntry = data.find(
      (entry: MonthlyEntry) => entry.month === month,
    ) || { month, data: [] };

    headNames.forEach((head: THead) => {
      const actual = monthEntry.data.find(
        (item: BudgetItem) => item.head === head.id && item.year === +onYearChange - 1,
      );
      const budget = monthEntry.data.find(
        (item: BudgetItem) => item.head === head.id && item.year === +onYearChange,
      );
      if (
        actual?.budgetAmount !== undefined &&
        actual?.budgetAmount !== null
      ) {
        totals[head.id].actual += Number(actual.budgetAmount) || 0;
      }
      if (
        budget?.budgetAmount !== undefined &&
        budget?.budgetAmount !== null
      ) {
        totals[head.id].budget += Number(budget.budgetAmount) || 0;
      }
    });
  });

  const handleFileAccepted = (file: File) => {
    console.log({ file });
    importBudgetCsv(file);
  };

  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending, setIsLoading]);

  useSyncLoading(importBudgetCsvPending);
  return (
    <main className="bg-offWhite min-h-[calc(100vh-72px)] p-6 overflow-auto">
      <article className="bg-white w-full min-h-[calc(100vh-120px)] rounded-2xl p-6 flex flex-col">
        <PageHeader title="Budget Review">
          <div className="flex items-center gap-2 h-10">
            {/* <button
              onClick={toggleScroll}
              className=" right-4 bottom-4 px-4 py-2 bg-purple-600 text-white rounded shadow"
            >
              {scrolledRight ? "Scroll Left" : "Scroll Right"}
            </button> */}
            <div className="w-36">
              <DropdownField
                name="siteID"
                placeholder="Select Site"
                options={siteOption || []}
                value={changeSiteValue}
                onChange={handleDropdownChange}
                height="h-10"
                contentClassName="w-36"
              />
            </div>

            <DropdownField
              name="year"
              value={onYearChange.toString()}
              onChange={(_, val) => setOnYearChange(val)}
              options={yearOptions}
              className="min-w-[140px] max-w-[140px]"
              contentClassName="min-w-[140px] max-w-[140px]"
              height="h-10"
            />

            <div className="h-full">
              <Button
                className="h-full inline-flex items-center gap-2 text-sm bg-skyBlue hover:bg-skyBlue hover:brightness-90"
                onClick={resetFilers}
              >
                <Image src={Reset} alt="Reset" className="text-white" />
                Reset
              </Button>
            </div>

            <ImportDialog
              apiCall={handleFileAccepted}
              params={{
                year: onYearChange.toString(),
                siteID: changeSiteValue,
                isTemplate: "true"
              }}
              url={UrlConfig.EXPORT_BUDGET_CSV}
            />

            <DropdownMenu>
              <DropdownMenuTrigger className="h-10" asChild>
                <div>
                  <Button className="h-full inline-flex items-center gap-2 text-sm bg-coffee hover:bg-coffee hover:brightness-90">
                    <Image
                      src={ExportIcon}
                      alt="Export"
                      className="text-white"
                    />
                    Export
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-26 border-lightTeal p-1"
                sideOffset={4}
                avoidCollisions={false}
                forceMount
              >
                <DropdownMenuItem onSelect={() => console.log("PDF")}>
                  Export PDF
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => {
                  const params = {
                    year: onYearChange.toString(),
                    siteID: changeSiteValue,
                  }
                  exportCSV(params, UrlConfig.EXPORT_BUDGET_CSV)
                }}>
                  Export CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </PageHeader>
        {!isLoading && !headIsloading && !siteLoading ? (
          <div className="overflow-auto" ref={scrollRef}>
            <table className="table-auto border border-gray-300 w-full text-sm">
              <thead className="bg-offWhite">
                <tr>
                  <th
                    rowSpan={2}
                    className="p-2 border font-medium border-lightTeal text-center text-slateGreen min-w-[100px]"
                  >
                    Month
                  </th>
                  <th
                    rowSpan={2}
                    className="p-2 border font-medium border-lightTeal text-center text-slateGreen min-w-[80px]"
                  >
                    Action
                  </th>
                  {headNames.map((head: THead) => (
                    <th
                      key={head.id}
                      colSpan={2}
                      className="p-2 border font-medium border-lightTeal text-center text-slateGreen min-w-[180px]"
                    >
                      {head.name}
                    </th>
                  ))}
                  <th
                    rowSpan={2}
                    className="p-2 border font-medium border-lightTeal text-center text-slateGreen min-w-[80px]"
                  >
                    Action
                  </th>
                </tr>
                <tr>
                  {headNames.map((head: THead) => (
                    <React.Fragment key={head.id}>
                      <th className="p-2 min-w-28 font-medium text-sm border-r bg-offWhite border-b border-lightTeal text-center text-slateGreen">
                        Actual {+onYearChange - 1}
                      </th>
                      <th className="p-2 min-w-28 font-medium text-sm border-r bg-offWhite border-b border-lightTeal text-center text-slateGreen">
                        Budget {+onYearChange}
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {months.map(
                  (month: string, rowIndex: number): React.ReactNode => {
                    const monthEntry: MonthlyEntry = data.find(
                      (entry: MonthlyEntry) => entry.month === month,
                    ) || { month, data: [] };
                    const isEditing = editingRow === rowIndex;
                    return (
                      <tr key={month} className="even:bg-gray-50 bg-white">
                        <td className="p-2 border border-lightTeal text-center text-slateGreen font-medium bg-white">
                          {month}
                        </td>
                        <td className="p-2 font-light text-sm border-r border-b border-lightTeal bg-white text-center">
                          {isEditing ? (
                            <div className="flex gap-2 justify-center">
                              <ToolTipWrapper toolTipText="Save">
                                <button onClick={() => handleSaveRow(rowIndex)}>
                                  <Image src={Save} alt="Save" />
                                </button>
                              </ToolTipWrapper>
                              <ToolTipWrapper toolTipText="Discard">
                                <button onClick={handleCancelEdit}>
                                  <Image src={Cross} alt="Cancel" />
                                </button>
                              </ToolTipWrapper>
                            </div>
                          ) : (
                            <div className="flex gap-1 justify-center">
                              <ToolTipWrapper toolTipText="Edit">
                                <button
                                  onClick={() =>
                                    handleEditRow(rowIndex, monthEntry)
                                  }
                                  className="text-black hover:underline text-xs px-2 py-1 rounded"
                                >
                                  <Image
                                    src={EditIcon}
                                    alt="Edit"
                                    className="text-black"
                                  />
                                </button>
                              </ToolTipWrapper>
                            </div>
                          )}
                        </td>
                        {headNames.map((head: THead) => {
                          const actual = monthEntry.data.find(
                            (item: BudgetItem) =>
                              item.head === head.id &&
                              item.year === +onYearChange - 1,
                          );
                          const budget = monthEntry.data.find(
                            (item: BudgetItem) =>
                              item.head === head.id &&
                              item.year === +onYearChange,
                          );
                          return (
                            <React.Fragment key={head.id}>
                              <td
                                className={`p-2 border border-lightTeal text-center bg-white ${isEditing && "bg-offWhite"} ${actual?.budgetAmount !== undefined && !isEditing ? "text-lightSlateGreen rounded" : "text-lightSlateGreen"}`}
                              >
                                {isEditing ? (
                                  <input
                                    type="text"
                                    className="w-[90%] border border-peach text-peach border-pink rounded p-1 text-center bg-white focus:outline-none focus:ring-peach"
                                    value={rowEditData[head.id]?.actual ?? ""}
                                    onChange={(e) =>
                                      setRowEditData((prev: RowEditData) => ({
                                        ...prev,
                                        [head.id]: {
                                          ...prev[head.id],
                                          actual: e.target.value,
                                        },
                                      }))
                                    }
                                    onInput={allowOnlyNumbers}
                                    maxLength={10}
                                  />
                                ) : actual?.budgetAmount !== undefined ? (
                                  `£${formatEnglishNumber(actual.budgetAmount)}`
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td
                                className={`p-2 border border-lightTeal text-center bg-white ${isEditing && "bg-offWhite"} ${budget?.budgetAmount !== undefined && !isEditing ? "text-lightSlateGreen  rounded" : "text-lightSlateGreen"}`}
                              >
                                {isEditing ? (
                                  <input
                                    type="text"
                                    className="w-[90%] border border-peach text-peach border-pink rounded p-1 text-center bg-white focus:outline-none focus:ring-peach"
                                    value={rowEditData[head.id]?.budget ?? ""}
                                    onChange={(e) =>
                                      setRowEditData((prev: RowEditData) => ({
                                        ...prev,
                                        [head.id]: {
                                          ...prev[head.id],
                                          budget: e.target.value,
                                        },
                                      }))
                                    }
                                    onInput={allowOnlyNumbers}
                                    maxLength={10}
                                  />
                                ) : budget?.budgetAmount !== undefined ? (
                                  `£${formatEnglishNumber(budget.budgetAmount)}`
                                ) : (
                                  "-"
                                )}
                              </td>
                            </React.Fragment>
                          );
                        })}

                        {/* Actions Column */}
                        <td className="p-2 font-light text-sm border-r border-b border-lightTeal bg-white text-center">
                          {isEditing ? (
                            <div className="flex gap-2 justify-center">
                              <ToolTipWrapper toolTipText="Save">
                                <button onClick={() => handleSaveRow(rowIndex)}>
                                  <Image src={Save} alt="Save" />
                                </button>
                              </ToolTipWrapper>
                              <ToolTipWrapper toolTipText="Discard">
                                <button onClick={handleCancelEdit}>
                                  <Image src={Cross} alt="Cancel" />
                                </button>
                              </ToolTipWrapper>
                            </div>
                          ) : (
                            <div className="flex gap-1 justify-center">
                              <ToolTipWrapper toolTipText="Edit">
                                <button
                                  onClick={() =>
                                    handleEditRow(rowIndex, monthEntry)
                                  }
                                  className="text-black hover:underline text-xs px-2 py-1 rounded"
                                >
                                  <Image
                                    src={EditIcon}
                                    alt="Edit"
                                    className="text-black"
                                  />
                                </button>
                              </ToolTipWrapper>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
              <tfoot>
                <tr className="bg-white font-semibold">
                  <td
                    className="p-2 border border-lightTeal text-center text-slateGreen font-semibold"
                    colSpan={2}
                  >
                    Total
                  </td>
                  {headNames.map((head: THead) => (
                    <React.Fragment key={head.id}>
                      <td className="p-2 border  border-lightTeal text-center text-slateGreen font-semibold">
                        {totals[head.id].actual
                          ? `£${formatEnglishNumber(totals[head.id].actual)}`
                          : "-"}
                      </td>
                      <td className="p-2 border  border-lightTeal text-center text-slateGreen font-semibold">
                        {totals[head.id].budget
                          ? `£${formatEnglishNumber(totals[head.id].budget)}`
                          : "-"}
                      </td>
                    </React.Fragment>
                  ))}
                  <td className="p-2 border border-lightTeal text-center bg-white" />
                </tr >
              </tfoot >
            </table >
          </div >
        ) : (
          <span>
            <TableLoader />
          </span>
        )}
      </article >
    </main >
  );
};

export default Page;
