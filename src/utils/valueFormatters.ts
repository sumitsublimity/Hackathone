export const formatCurrency = (
  value: string | number | null | undefined,
  currency: string = "GBP",
  locale: string = "en-GB",
): string => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  if (numericValue == null || isNaN(numericValue)) return "-";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

export const formatPercentage = (
  value: string | number | null | undefined,
  fractionDigits: number = 2,
): string => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  if (numericValue == null || isNaN(numericValue)) return "-";
  return `${(numericValue * 100).toFixed(fractionDigits)}%`;
};

export const formatNumber = (
  value: string | number | null | undefined,
  locale: string = "en-GB",
): string => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  if (numericValue == null || isNaN(numericValue)) return "-";
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};
