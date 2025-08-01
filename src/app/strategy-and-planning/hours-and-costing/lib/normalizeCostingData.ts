import { CategoryItem, CostingItem, NormalizedCosting } from "../types/types";

export function normalizeCostingData(
  costingData: CostingItem[],
  categoryList: CategoryItem[],
  ageGroups: string[],
): NormalizedCosting[] {
  const categoryMap = new Map(categoryList.map((c) => [c.id, c.name]));

  const dataMap = new Map<string, Record<string, string>>();

  for (const item of costingData) {
    const categoryName = categoryMap.get(item.category);
    if (!categoryName) continue;

    if (!dataMap.has(categoryName)) {
      dataMap.set(categoryName, {});
    }

    const ageCostMap = dataMap.get(categoryName)!;
    ageCostMap[item.ageGroup] = item.costing;
  }

  const allRows: NormalizedCosting[] = [];

  for (const { id, name } of categoryList) {
    const ageCostMap = dataMap.get(name) || {};
    const fullAgeMap: Record<string, string> = {};

    for (const age of ageGroups) {
      fullAgeMap[age] = ageCostMap[age] || "";
    }

    allRows.push({
      categoryName: name,
      ageGroupCostingMap: fullAgeMap,
    });
  }

  return allRows;
}
