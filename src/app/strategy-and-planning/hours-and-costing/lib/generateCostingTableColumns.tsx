import { ColumnDef, CellContext } from "@tanstack/react-table";
import { NormalizedCosting } from "../types/types";
import { formatCurrency } from "@/utils/valueFormatters";

export function generateCostingTableColumns(
  ageGroups: string[],
): ColumnDef<NormalizedCosting>[] {
  return [
    {
      accessorKey: "categoryName",
      size: 300,
      header: "Category",
      cell: (info: CellContext<NormalizedCosting, unknown>) => {

        return <div className="text-left p-2">{info.getValue() as string}</div>;
      },
    },
    ...ageGroups.map((group) => ({
      accessorKey: `ageGroupCostingMap.${group}`,
      header: group,
      cell: (info: CellContext<NormalizedCosting, unknown>) => {
        const value = info.getValue() as number;
        const formattedValue = formatCurrency(value)
        return (
          <div className="text-center p-2">{value ? `${formattedValue}` : "-"}</div>
        );
      },
    })),
  ];
}
