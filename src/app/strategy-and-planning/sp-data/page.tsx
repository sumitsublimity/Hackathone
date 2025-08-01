"use client";

import Cross from "@/../public/icons/cross1.svg";
import EditIcon from "@/../public/icons/edit-row.svg";
import ExportIcon from "@/../public/icons/export.svg";
import ImportIcon from "@/../public/icons/import.svg";
import Reset from "@/../public/icons/reset.svg";
import Save from "@/../public/icons/save1.svg";
import Button from "@/components/Button";
import { DialogBox } from "@/components/DialogBox";
import DropdownField from "@/components/DropdownField";
import PageHeader from "@/components/PageHeader";
import { months } from "@/utils/constants";
import { formatEnglishNumber, getFiveYearOptions } from "@/utils/yearUtils";

import AccordionUp from "@/../public/icons/AccordionUp.svg";
import AccordionDown from "@/../public/icons/accordiondown.svg";
import { ToolTipWrapper } from "@/app/management-job-tracker/goals/_components/ToolTipWrapper";
import { TableLoader } from "@/components/TableLoader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useSiteDropdownList
} from "@/services/api/site/fetchSiteDropdownOptions";
import { useGetSPExpense, useUpdateExpense } from "@/services/query/S&P-query/S&P.query";
import { SiteOption } from "@/utils/interface";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import BudgetSPTable from "./BudgetSPTable";
import { ExpenseHeadType, useDynamicExpenseHead } from "./useDynamicExpenseHead";
import { allowOnlyNumbers } from "@/utils/inputSanitizers";
import DragAndDropFile from "@/components/DragAndDropFile";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import ImportDialog from "@/components/ui/ImportModal";
import { useSyncLoading } from "@/hooks/useSyncLoading";

// Type for editing expense fields
export type TEditExpense = {
  chefSalary: string;
  food: string;
  total?: string;
  [key: string]: string | undefined;
  month?: string;
  siteID?: string;


};

type TExpenseRecord = {
  month: string;
  year: number;
  expensesObject: {
    [key: string]: number; // dynamic keys like "Gas & Electric", "chefSalary", etc.
  };
  siteID: string;
};
const Page = () => {
  const { yearOptions, currentYear } = useMemo(() => getFiveYearOptions(), []);
  const [onYearChange, setOnYearChange] = useState(currentYear);

  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<TEditExpense>({ chefSalary: '', food: '', total: '' });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [siteOption, setSiteOption] = useState<SiteOption[]>([]);
  const [changeSiteValue, setChangeSiteValue] = useState("");
  const [classRoom, setClassRoom] = useState("");

  const [openItems, setOpenItems] = useState<string[]>(["Expense", "SPData"]);

  const { data: site, isLoading: siteIsLoading } = useSiteDropdownList();
  const dynamicExpenseHead = useDynamicExpenseHead(classRoom);

  const {
    data = [],
    isLoading,
    isError,
  } = useGetSPExpense(onYearChange, changeSiteValue);

  const { mutate: updateExpense, isPending: isUpdateExpensePending } = useUpdateExpense();

  useEffect(() => {
    // getQueryHead();
    if (site && site.length > 0) {
      setSiteOption(site);
      setChangeSiteValue(site[0]?.value);
      setClassRoom(site[0].classRoom);
    }
  }, [site]);

  useEffect(() => {
    setEditingRow(null);
    setEditingData({ chefSalary: '', food: '', total: '' });
  }, [onYearChange]);



  const handleEditRow = (rowIndex: number, rowObj: TExpenseRecord) => {
    const expenses = rowObj?.expensesObject || {};
    const newEditingData: TEditExpense = { chefSalary: '', food: '', total: '' };

    dynamicExpenseHead.forEach((item: ExpenseHeadType) => {
      if (!item.divide) {
        const value = expenses[item.value];
        newEditingData[item.value] = value !== undefined && value !== null ? String(value) : "";
      }
    });

    setEditingRow(rowIndex);
    setEditingData(newEditingData);
  };


  const handleSaveRow = (rowIndex: number) => {
    // Use editingData to update your data array or send to API
    // Example: update data[rowIndex].expensesObject with editingData
    delete editingData.total;
    updateExpense({ ...editingData, year: onYearChange, siteID: changeSiteValue, month: normalizedData[rowIndex].month });
    setEditingRow(null);
    setEditingData({ chefSalary: '', food: '', total: '' });
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditingData({ chefSalary: '', food: '', total: '' });
  };


  const handleExport = (type: string) => {
    console.log({ type });
  };

  const handleDropdownChange = (name: string, value: string) => {
    setChangeSiteValue(value);
    const filterData = site.find((item: SiteOption) => item.value == value);
    setClassRoom(filterData.classRoom);
  };
  const resetFilers = () => {
    setChangeSiteValue(siteOption[0]?.value);
    setOnYearChange(currentYear);
    setEditingRow(null);
    setEditingData({ chefSalary: '', food: '', total: '' });
  };
  const scrollRef = useRef<HTMLDivElement>(null);
  const handleValueChange = (type: string, values: any) => {
    console.log({ type, values });
  };

  const updateEditingValue = (key: string, value: string) => {
    setEditingData((prev: TEditExpense) => ({
      ...prev,
      [key]: value,
    }));
  };


  const expenseKeys = dynamicExpenseHead.map(h => h.value).filter(v => v !== "total");

  // Normalized data for table rendering
  const normalizedData = useMemo(() => {
    return months.map((month) => {
      const rowObj = data.find((d: TExpenseRecord) => d.month === month);
      const expenses = rowObj?.expensesObject || {};
      let normalizedExpenses: Record<string, number> = {};
      let total = 0;

      expenseKeys.forEach(key => {
        let value = Number(expenses[key] ?? 0);

        // Find the corresponding expense head to check if it should be divided
        const expenseHead = dynamicExpenseHead.find(head => head.value === key);

        if (expenseHead?.divide && classRoom) {
          value = value / Number(classRoom);
        }

        normalizedExpenses[key] = value;
        total += value;
      });

      normalizedExpenses["total"] = total;

      return {
        month,
        expenses: normalizedExpenses,
        raw: rowObj, // keep original if needed for editing
      };
    });
  }, [data, months, classRoom, dynamicExpenseHead]);


  console.log({ normalizedData });

  const handleFileAccepted = (file: File) => {
    console.log({ file });
    setSelectedFile(file);
  };

  useSyncLoading(isUpdateExpensePending);

  return (
    <main className="bg-offWhite min-h-[calc(100vh-72px)] p-6 overflow-auto">
      <article className="bg-white w-full min-h-[calc(100vh-120px)] rounded-2xl p-6 flex flex-col">
        <PageHeader title="S&P Data">
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
                <Image src={Reset} alt="Export" className="text-white" />
                Reset
              </Button>
            </div>
            <ImportDialog apiCall={handleFileAccepted} />

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
                <DropdownMenuItem onSelect={() => console.log("CSV")}>
                  Export CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </PageHeader>

        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={(values) => {
            setOpenItems(values); // control toggle
            handleValueChange("SPData", values);
          }}
          className="mb-3 flex flex-col gap-y-3 w-full"
        >
          <AccordionItem
            value="SPData"
            className="border-none rounded-none border-slateGreen border"
          >
            <AccordionTrigger
              className={`bg-offWhite border border-lightTeal p-2 flex w-full hover:no-underline rounded-none text-slateGreen justify-between after:content-none [&>svg]:hidden cursor-pointer`}
            >
              <span>S&P Data</span>
              <Image
                src={openItems.includes("SPData") ? AccordionDown : AccordionUp}
                alt="Chevron Icon"
                className="w-5 h-5 transition-all duration-200"
              />
            </AccordionTrigger>

            <AccordionContent className="border-none bg-none">
              <BudgetSPTable onYearChange={onYearChange} changeSiteValue={changeSiteValue} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={(values) => {
            setOpenItems(values); // control toggle
            handleValueChange("expense", values);
          }}
          className="mb-3 flex flex-col gap-y-3 w-full"
        >
          <AccordionItem
            value="Expense"
            className="border-none rounded-none border-slateGreen border"
          >
            <AccordionTrigger
              className={`bg-offWhite border border-lightTeal p-2 flex w-full hover:no-underline rounded-none text-slateGreen justify-between after:content-none [&>svg]:hidden cursor-pointer`}
            >
              <span>Expense</span>
              <Image
                src={
                  openItems.includes("Expense") ? AccordionDown : AccordionUp
                }
                alt="Chevron Icon"
                className="w-5 h-5 transition-all duration-200"
              />
            </AccordionTrigger>

            <AccordionContent className="border-none bg-none">
              {!isLoading && !siteIsLoading ? (
                <div className="overflow-auto" ref={scrollRef}>
                  <table className="table-auto border border-gray-300 w-full text-sm">
                    <thead className="bg-offWhite">
                      <tr>
                        <th className="p-2 font-medium text-sm border bg-offWhite border-lightTeal text-center text-slateGreen">
                          Month
                        </th>
                        {dynamicExpenseHead.map((item: ExpenseHeadType, index: number) => (
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
                      {normalizedData.map((row, rowIndex) => {
                        const isEditing = editingRow === rowIndex;
                        const expenses = row.expenses;
                        return (
                          <tr key={rowIndex} className="even:bg-gray-50">
                            <td className="p-2 font-light text-sm border bg-white border-lightTeal text-center text-slateGreen">
                              {row.month}
                            </td>
                            {/* Expense Cells by Head */}
                            {dynamicExpenseHead.map((item: ExpenseHeadType, index: number) => {
                              if (item.value === "total") {
                                return (
                                  <td key={index} className="p-2 font-light text-sm border bg-white border-lightTeal text-center text-slateGreen">
                                    {expenses["total"] !== 0 ? `£${formatEnglishNumber(expenses[item.value])}`
                                      : "-"}
                                  </td>
                                );
                              }
                              return (
                                <td
                                  key={index}
                                  className="p-2 font-light text-sm border bg-white border-lightTeal text-center text-slateGreen"
                                >
                                  {isEditing && item.editable ? (
                                    <input
                                      type="text"
                                      maxLength={10}
                                      onInput={allowOnlyNumbers}
                                      value={editingData[item.value] ?? ""}
                                      onChange={e => updateEditingValue(item.value, e.target.value)}
                                      className="w-20 px-2 py-1 text-center border-1 border-peachyPink rounded focus:outline-none text-peachyPink"
                                    />
                                  ) : (
                                    expenses[item.value] !== undefined && expenses[item.value] !== 0
                                      ? `£${formatEnglishNumber(expenses[item.value])}`
                                      : "-"
                                  )}
                                </td>
                              );
                            })}
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
                                      onClick={() => handleEditRow(rowIndex, row.raw)}
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
              ) : (
                <span>
                  <TableLoader />
                </span>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </article>
    </main>
  );
};

export default Page;
