import { getCategoryList } from "@/services/api/strategyAndPlanning/hoursAndCosting";
import { Category, CategoryListResponse, CategoryOption } from "../types/types";

export async function fetchCategoryList(): Promise<CategoryOption[]> {
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

    const categories = Array.isArray(response?.responsePacket)
      ? response.responsePacket
      : [];

    const categoryList: CategoryOption[] = categories.map(
      (detail: Category) => {
        return { id: detail.id, name: detail.name };
      },
    );

    return categoryList;
  } catch (error) {
    console.error("Failed to fetch category list", error);
    return [];
  }
}
