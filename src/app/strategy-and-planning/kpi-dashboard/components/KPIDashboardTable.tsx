import { formatCurrency } from "@/utils/valueFormatters";
import { MONTHS } from "../configs/tableConfigs";
import { KPIDashboardTableProps } from "../types/kpiDashboard.types";
import { calculateGrandTotal } from "../lib/calculateGrandTotal";

export function KPIDashboardTable({
  data,
  rows,
  showHeaders = true,
  showGrandTotal = false,
  // grandTotalLabel adds text to last row of the table.
  grandTotalLabel = "Grand Total",
  // grandTotal can be provided externally or inside this component using calculateGrandTotal()
  grandTotal: externalGrandTotal,
  // rowToSumLabel adds only the values of that labelled row from tableConfigs
  rowToSumLabel
}: KPIDashboardTableProps) {

  const grandTotal = externalGrandTotal ?? calculateGrandTotal(data, rows, rowToSumLabel);
  const formattedGrandTotal = externalGrandTotal ?? formatCurrency(grandTotal);

  return (
    <div className="space-y-4">
      <div className="border-t border-l border-lightTeal">
        <table className="w-full">
          {/* ++++++++++ Section: Month Header ++++++++++ */}
          {showHeaders && (
            <thead className="bg-[var(--table-header-bg-secondary)] text-[var(--font-darkGray)]">
              <tr>
                <th className="p-2 w-[150px] h-9 font-medium text-sm border-r bg-offWhite border-b border-lightTeal text-center text-slateGreen break-words whitespace-normal">
                  Category
                </th>
                {MONTHS.map((month, i) => (
                  <th
                    key={`${month.value}-${i}`}
                    className=" w-[150px] p-2 h-9 font-medium text-sm border-r bg-offWhite border-b border-lightTeal  text-slateGreen break-words whitespace-normal text-center"
                  >
                    {month.label}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          {/* ++++++++++ Section: Table Body ++++++++++ */}
          <tbody>
            {rows.map((row, i) => {
              return (
                <tr
                  key={`${row.label}-${i}`}
                  className="border-t border-[var(--table-border-bg)]"
                >
                  <th
                    className={`${row.label === "Total" ? "font-bold" : "font-medium"} px-2 w-[150px] py-0 h-9 text-sm text-slateGreen border-r border-b border-lightTeal text-left`}
                  >
                    {row.label}
                  </th>

                  {MONTHS.map((month, i) => {
                    const entry = data.find((d) => d.month === month.value);
                    const value = entry ? row.getValue(entry) : undefined;
                    const output = row.format
                      ? row.format(value)
                      : value !== undefined && value !== null
                        ? `£ ${value}`
                        : "-"
                    return (
                      <td
                        key={`${month.value}-${i}`}
                        className={`${row.label === 'Total' ? 'font-bold' : 'font-normal'} text-center w-[150px] px-2 py-0 text-sm text-slateGreen border-r border-b border-lightTeal`}
                      >
                        {output}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          {/* ++++++++++ Section: Table Footer ++++++++++ */}
          {showGrandTotal && (
            <tfoot className="border-2 border-slateGreen">
              <tr className="border-t border-[var(--table-border-bg)]">
                <th
                  colSpan={MONTHS.length - 1}
                  className="px-2 py-0 h-9 text-sm font-bold text-slateGreen border-r border-b border-lightTeal text-right">
                  {grandTotalLabel}
                </th>
                <td
                  colSpan={MONTHS.length}
                  className="w-[150px] px-2 py-0 text-sm border-2 text-slateGreen border-r border-b text-left font-bold"
                >
                  {formattedGrandTotal}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
