import { getCategoryList } from "@/services/api/strategyAndPlanning/hoursAndCosting";
import {
  Category,
  CategoryListResponse,
  DropdownCategoryOptions,
} from "../types/types";

export async function fetchCategoryOptions(): Promise<
  DropdownCategoryOptions[]
> {
  try {
    const response = (await getCategoryList({
      searchFilters: [],
      sortRules: [
        {
          columnName: "name",
          operation: "ASC",
        },
      ],
    })) as CategoryListResponse;

    const categories: Category[] = response.responsePacket || [];
    const categoryOptions: DropdownCategoryOptions[] = categories.map(
      (category: Category) => ({
        label: category.name,
        value: String(category.id),
      }),
    );

    return categoryOptions;
  } catch (error) {
    console.error("Failed to fetch category options:", error);
    return [];
  }
}
