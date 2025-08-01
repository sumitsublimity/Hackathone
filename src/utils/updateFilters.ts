type Filter = {
  columnName: string;
  columnValue: any;
  columnType: string;
  operation: string;
};

type UpdateSearchFiltersParams = {
  prevFilters: Filter[];
  name: string;
  value: any;
  columnType?: string;
  operation?: string;
};

export function updateSearchFilters({
  prevFilters,
  name,
  value,
  columnType = "STRING",
  operation = "EQUALS",
}: UpdateSearchFiltersParams): Filter[] {
  const isEmpty =
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "");

  if (isEmpty) {
    return prevFilters.filter((f) => f.columnName !== name);
  }

  const updatedFilter: Filter = {
    columnName: name,
    columnValue: value,
    columnType,
    operation,
  };

  const existingIndex = prevFilters.findIndex((f) => f.columnName === name);

  if (existingIndex !== -1) {
    const newFilters = [...prevFilters];
    newFilters[existingIndex] = updatedFilter;
    return newFilters;
  }

  return [...prevFilters, updatedFilter];
}
