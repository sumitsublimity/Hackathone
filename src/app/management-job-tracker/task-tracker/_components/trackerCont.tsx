"use client";

import React, { useEffect, useMemo, useState } from "react";
import DropdownField from "@/components/DropdownField";
import {
  MonthYearPickerProps,
  WeekColorParams,
  WeekStyleParams,
} from "@/utils/interface";
import { getSiteKeyValueList } from "@/services/api/staff/staff";
import { showToast } from "@/utils/alert";
import { ALERT_TYPES } from "@/utils/constants";
import { getFiveYearOptions } from "@/utils/yearUtils";

const getMonthOptions = () =>
  Array.from({ length: 12 }, (_, i) => ({
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
    value: i.toString(),
  }));

export const MonthYearPicker = ({
  selectedMonth,
  selectedYear,
  selectedSiteID,
  onMonthChange,
  onYearChange,
  onSiteChange,
}: MonthYearPickerProps) => {
  const { yearOptions } = useMemo(() => getFiveYearOptions(), []);
  const [siteOptions, setSiteOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await getSiteKeyValueList({
        searchFilters: [
          {
            columnName: "inActive",
            columnType: "BOOLEAN",
            columnValue: false,
            operation: "EQUAL_TO",
          },
        ],
        sortRules: [{ columnName: "createdAt", operation: "DESC" }],
      });

      const sites = response.responsePacket || [];
      const options = sites.map((site: any) => ({
        label: site.name,
        value: String(site.id),
      }));

      setSiteOptions(options);

      // Optional: auto-select first site if not already selected
      if (!selectedSiteID && options.length > 0) {
        onSiteChange(options[0].value);
      }
    } catch (error) {
      console.error("Failed to fetch site list:", error);
      showToast("Failed to fetch site list", ALERT_TYPES.ERROR);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 sm:flex-nowrap sm:gap-4 w-full sm:w-auto">
      <DropdownField
        name="siteID"
        value={selectedSiteID}
        onChange={(_, val) => onSiteChange(val)}
        options={siteOptions}
        className="sm:w-[200px]"
        contentClassName="sm:w-[200px]"
        placeholder="Select Site"
      />
      <DropdownField
        name="month"
        value={selectedMonth.toString()}
        onChange={(_, val) => onMonthChange(Number(val))}
        options={getMonthOptions()}
        className="sm:min-w-[140px]"
        contentClassName="sm:min-w-[140px]"
      />
      <DropdownField
        name="year"
        value={selectedYear.toString()}
        onChange={(_, val) => onYearChange(Number(val))}
        options={yearOptions}
        className="sm:min-w-[140px]"
        contentClassName="sm:min-w-[140px]"
      />
    </div>
  );
};

// Color function
export const getWeekColorClass = ({
  index,
  hasExtraStart,
  hasExtraEnd,
  totalWeeks,
}: WeekColorParams): string => {
  const isExtra =
    (hasExtraStart && index === 0) || (hasExtraEnd && index === totalWeeks - 1);

  if (isExtra) return "bg-[var(--color-iceBlue)]";

  switch (index - (hasExtraStart ? 1 : 0)) {
    case 0:
      return "bg-[var(--color-lightPink)]";
    case 1:
      return "bg-[var(--color-paleCream)]";
    case 2:
      return "bg-[var(--color-offWhite)]";
    case 3:
      return "bg-[var(--color-greenishGray)]";
    default:
      return "bg-[var(--color-iceBlue)]";
  }
};

export const getWeekWidthStyle = ({
  week,
  index,
  hasExtraStart,
  hasExtraEnd,
  totalWeeks,
}: WeekStyleParams): { width: string; minWidth: string } => {
  const isExtra =
    (hasExtraStart && index === 0) || (hasExtraEnd && index === totalWeeks - 1);
  const activeDaysCount = week.days.filter(Boolean).length;

  if (isExtra) {
    const width = Math.max(100, 120 + (activeDaysCount - 3) * 25);
    return { width: `${width}px`, minWidth: "100px" };
  }

  return { width: "220px", minWidth: "220px" };
};

export function formatDateLocal(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const formatter = new Intl.DateTimeFormat("en-CA", options); // en-CA returns YYYY-MM-DD
  return formatter.format(date);
}
