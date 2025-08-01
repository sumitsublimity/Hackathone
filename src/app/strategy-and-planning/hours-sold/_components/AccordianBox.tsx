import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AccordionUp from "@/../public/icons/AccordionUp.svg";
import AccordionDown from "@/../public/icons/accordiondown.svg";
import Image from "next/image";
import { EditableRow } from "./EditableRow";
import { useGetHoursSold } from "@/services/query/hours-sold-query/hours-sold-query";
import { TableLoader } from "@/components/TableLoader";
import NoDataBanner from "@/components/NoDataBanner";
import AddForm from "./AddForm";
import AddIcon from "@/utils/AddIcon";
import Button from "@/components/Button";
import { useSyncLoading } from "@/hooks/useSyncLoading";

function AccordionBox({ SiteAgeGroup, changeSiteId, data }: any) {
  const [openItems, setOpenItems] = useState<any>({});
  const [editingIndexes, setEditingIndexes] = useState<
    Record<string, number | null>
  >({});

  const handleEdit = (groupId: string, rowIndex: number | null) => {
    setEditingIndexes((prev) => ({ ...prev, [groupId]: rowIndex }));
  };

  const { data: hoursSoldData, isLoading } = useGetHoursSold(
    data.site,
    data.month,
    data.year,
  );

  const defaultOpenIds = hoursSoldData?.map((item: any) => item.ageGroup) || [];
  const columns = [
    { accessorKey: "name", header: "Name", className: "text-center w-[25%]" },
    {
      accessorKey: "Week 1",
      header: "Week 1",
      className: "text-center w-[12%]",
    },
    {
      accessorKey: "Week 2",
      header: "Week 2",
      className: "text-center w-[12%]",
    },
    {
      accessorKey: "Week 3",
      header: "Week 3",
      className: "text-center w-[12%]",
    },
    {
      accessorKey: "Week 4",
      header: "Week 4",
      className: "text-center w-[12%]",
    },
    { accessorKey: "Extra", header: "Extra", className: "text-center w-[12%]" },
    {
      accessorKey: "Actions",
      header: "Actions",
      className: "text-center w-[15%]",
    },
  ];

  const total = [
    {
      accessorKey: "Week 1",
      header: "Week 1",
      className: "text-center w-[12%]",
    },
    {
      accessorKey: "Week 2",
      header: "Week 2",
      className: "text-center w-[12%]",
    },
    {
      accessorKey: "Week 3",
      header: "Week 3",
      className: "text-center w-[12%]",
    },
    {
      accessorKey: "Week 4",
      header: "Week 4",
      className: "text-center w-[12%]",
    },
    { accessorKey: "Extra", header: "Extra", className: "text-center w-[12%]" },
    {
      accessorKey: "",
      header: "",
      className: "text-center w-[15%]",
    },
  ];
  const grand = [
    {
      accessorKey: "",
      header: "",
      className: "text-center w-[12%]",
    },
    {
      accessorKey: "",
      header: "",
      className: "text-center w-[12%]",
    },
    {
      accessorKey: "",
      header: "",
      className: "text-center w-[12%]",
    },
    {
      accessorKey: "",
      header: "",
      className: "text-center w-[12%]",
    },
    { accessorKey: "Extra", header: "Extra", className: "text-center w-[28%]" },
  ];

  const handleValueChange = (values: any) => {
    const newState: any = {};
    hoursSoldData?.forEach((item: any) => (newState[item.id] = false));
    values.forEach((value: any) => (newState[value] = true));
    setOpenItems(newState);
  };

  const calculateTotals = (rows: any[]) => {
    const totals: any = {
      name: "Total",
      "Week 1": 0,
      "Week 2": 0,
      "Week 3": 0,
      "Week 4": 0,
      Extra: 0,
    };

    rows.forEach((row: any) => {
      row.weeks.forEach((week: any) => {
        if (totals.hasOwnProperty(week.name)) {
          totals[week.name] += Number(week.totalHours) || 0;
        }
      });
    });

    return totals;
  };

  function calculateGrandTotals(groups: any[]) {
    const grandTotal: any = {
      "Week 1": 0,
      "Week 2": 0,
      "Week 3": 0,
      "Week 4": 0,
      Extra: 0,
    };

    groups?.forEach((group) => {
      group?.data.forEach((student: any) => {
        student.weeks.forEach((week: any) => {
          const weekName = week.name;
          const value = Number(week.totalHours || 0);
          if (grandTotal[weekName] !== undefined) {
            grandTotal[weekName] += value;
          }
        });
      });
    });

    return grandTotal;
  }
  const grandTotals = calculateGrandTotals(hoursSoldData);
  const total1 = Object.values(grandTotals).reduce(
    (sum: number, val) => sum + Number(val),
    0,
  );

  return (
    <>
      {isLoading ? (
        <TableLoader />
      ) : hoursSoldData?.length > 0 ? (
        <>
          <Accordion
            type="multiple"
            onValueChange={handleValueChange}
            className="mb-3 flex flex-col gap-y-3"
            defaultValue={defaultOpenIds}
          >
            {hoursSoldData?.map((item: any, index: any) => (
              <AccordionItem
                key={index}
                value={item.ageGroup}
                className="border-none rounded-none border-slateGreen border "
              >
                <AccordionTrigger
                  className={`bg-offWhite border ${openItems[item.ageGroup] && "border-b-0"}  border-lightTeal  p-2 hover:no-underline rounded-none text-slateGreen justify-between after:content-none [&>svg]:hidden cursor-pointer`}
                >
                  <span className="">{item.ageGroup}</span>
                  <Image
                    src={openItems[item.ageGroup] ? AccordionDown : AccordionUp}
                    alt="Chevron Icon"
                    className="w-5 h-5 transition-all duration-200"
                  />
                </AccordionTrigger>
                <AccordionContent className="border-none bg-none ">
                  {item.data.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full border border-gray-300 text-sm">
                        <thead className="bg-offWhite text-slateGreen">
                          <tr>
                            {columns.map((col, idx) => (
                              <th
                                key={idx}
                                className={`p-2 border-t-0 text-sm border bg-offWhite border-lightTeal text-slateGreen font-medium text-center ${col.className || ""
                                  }`}
                              >
                                {col.header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {item.data.map((row: any, rowIndex: number) => (
                            <EditableRow
                              key={rowIndex}
                              rowData={row}
                              rowIndex={rowIndex}
                              editingIndex={
                                editingIndexes[item.ageGroup] ?? null
                              }
                              onEditChange={(index: any) =>
                                handleEdit(item.ageGroup, index)
                              }
                              changeSiteId={changeSiteId}
                              item={item}
                              data={data}
                            />
                          ))}
                          <tr className="bg-gray-100 font-semibold">
                            <td className="w-[20%] p-2 text-sm border bg-white border-lightTeal text-center text-slateGreen">
                              Total
                            </td>
                            {[
                              "Week 1",
                              "Week 2",
                              "Week 3",
                              "Week 4",
                              "Extra",
                            ].map((key) => (
                              <td
                                key={key}
                                className="p-2 text-sm border bg-white border-lightTeal text-center text-slateGreen"
                              >
                                {calculateTotals(item.data)[key]}
                              </td>
                            ))}
                            <td className="p-2 text-sm border bg-white border-lightTeal text-center text-slateGreen"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-4 text-gray-500">No data available.</div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* After all accordion items */}
          <div className="overflow-x-auto mt-2">
            <table className="table-auto w-full border border-gray-300 text-sm">
              <tbody>
                <tr className="bg-white font-semibold text-slateGreen">
                  <td className="p-2 border border-lightTeal border-t-0 text-center ">
                    Total Hours
                  </td>
                  {total.map((key, index) => (
                    <td
                      key={index}
                      className={`p-2 text-sm border border-t-0 font-bold bg-white border-lightTeal text-slateGreen  text-center ${key.className || ""
                        }`}
                    >
                      {grandTotals[key.accessorKey]}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto ">
            <table className="table-auto w-full border-t-0  border-gray-300 text-sm">
              <tbody className="">
                <tr className="bg-white font-semibold text-slateGreen">
                  <td className="p-2 text-sm border bg-white border-lightTeal border-t-0 text-right pr-4">
                    Grand Total Hours
                  </td>
                  <td className="p-2 w-[27%] text-sm border border-t-0 bg-white border-lightTeal text-left font-bold">
                    {total1}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <NoDataBanner bannerText=" There are no Hours Sold">
            <AddForm
              title="Add Hours Sold"
              btn={
                <Button className="h-12 inline-flex items-center gap-2 text-sm bg-peach hover:bg-peach hover:brightness-90">
                  <AddIcon />
                  Add Now
                </Button>
              }
              siteAgeGroup={SiteAgeGroup}
              changeSiteId={changeSiteId}
            />
          </NoDataBanner>
        </>
      )}
    </>
  );
}

export default AccordionBox;
