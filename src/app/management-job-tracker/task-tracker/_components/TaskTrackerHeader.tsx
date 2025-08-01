"use client";

import React from "react";
import WeekChart from "./WeekChart";
import { getWeeksInMonth } from "@/utils/getWeeksInMonth";
import { TaskTrackerHeaderProps } from "@/utils/interface";
import { getWeekColorClass, getWeekWidthStyle } from "./trackerCont";

const daysShort = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const TaskTrackerHeader = ({
  selectedMonth,
  selectedYear,
  siteLogo,
  data = [],
  localStatuses,
}: TaskTrackerHeaderProps) => {
  const { fullWeeks, extraStartWeek, extraEndWeek } = getWeeksInMonth(selectedMonth, selectedYear);

  const allWeeks = [
    ...(extraStartWeek ? [extraStartWeek] : []),
    ...fullWeeks,
    ...(extraEndWeek ? [extraEndWeek] : []),
  ];

  const totalWeeks = allWeeks.length;
  const hasExtraStart = !!extraStartWeek;
  const hasExtraEnd = !!extraEndWeek;

  return (
    <div className="border-t border-gray-300">
      <table className="border-collapse w-fit min-w-full table-fixed text-xs sm:text-sm">
        <thead>
          {/* Week Header Row */}
          <tr>
            <th className="w-[120px] sm:w-[160px] px-2 py-2 bg-lightTeal text-slateGreen text-center font-semibold border border-lightTeal">
              {new Date(selectedYear, selectedMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </th>
            {allWeeks.map((week, i) => (
              <th
                key={`week-header-${i}`}
                colSpan={week.days.filter(Boolean).length}
                className={`text-center font-bold text-slateGreen border border-lightTeal ${getWeekColorClass({
                  index: i,
                  hasExtraStart,
                  hasExtraEnd,
                  totalWeeks,
                })}`}
                style={getWeekWidthStyle({ week, index: i, hasExtraStart, hasExtraEnd, totalWeeks })}
              >
                {(hasExtraStart && i === 0) || (hasExtraEnd && i === totalWeeks - 1)
                  ? "EXTRA DAYS"
                  : `WEEK ${i + 1 - (hasExtraStart ? 1 : 0)}`}
              </th>
            ))}
          </tr>

          {/* Week Chart Row */}
          <tr>
            <td className="w-[100px] sm:w-[160px] h-[100px] sm:h-[150px] bg-white border border-lightTeal text-center">
              {siteLogo && (
                <div className="mb-1 sm:mb-2">
                  <img
                    src={siteLogo}
                    alt="Site Logo"
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-contain inline-block mt-2 sm:mt-4"
                  />
                </div>
              )}
            </td>
            {allWeeks.map((week, i) => {
              const validDays = week.days.filter(Boolean);
              const total = data.length * validDays.length;
              let completed = 0;

              validDays.forEach((day) => {
                const dateStr = day!.toDateString();
                data.forEach((task) => {
                  const key = `${task._id}-${dateStr}`;
                  const isChecked =
                    localStatuses[key] ??
                    task.status.some(
                      (s) => new Date(s.date).toDateString() === dateStr && s.status === "Completed"
                    );
                  if (isChecked) completed++;
                });
              });

              const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <td
                  key={`chart-${i}`}
                  colSpan={validDays.length}
                  className={`h-[100px] sm:h-[150px] border border-lightTeal ${getWeekColorClass({
                    index: i,
                    hasExtraStart,
                    hasExtraEnd,
                    totalWeeks,
                  })}`}
                >
                  <WeekChart
                    percentage={percentage}
                    fullSize={!((hasExtraStart && i === 0) || (hasExtraEnd && i === totalWeeks - 1))}
                    size={
                      !((hasExtraStart && i === 0) || (hasExtraEnd && i === totalWeeks - 1))
                        ? 120
                        : 80
                    }
                  />
                </td>
              );
            })}
          </tr>

          {/* Day Name Row */}
          <tr>
            <td className="w-[100px] sm:w-[160px] text-center bg-white border border-lightTeal text-[10px] sm:text-[11px] font-medium text-gray-600">
              Mo
            </td>
            {allWeeks.map((week, i) =>
              week.days.filter(Boolean).map((day, j) => (
                <td
                  key={`day-name-${i}-${j}`}
                  className={`border border-lightTeal text-[10px] sm:text-[11px] font-medium py-1 text-gray-600 text-center ${getWeekColorClass({
                    index: i,
                    hasExtraStart,
                    hasExtraEnd,
                    totalWeeks,
                  })}`}
                >
                  {daysShort[day!.getDay() === 0 ? 6 : day!.getDay() - 1]}
                </td>
              ))
            )}
          </tr>

          {/* Date Numbers Row */}
          <tr>
            <td className="w-[100px] sm:w-[160px] text-center bg-white border border-lightTeal text-[10px] sm:text-[11px] font-medium text-gray-600" />
            {allWeeks.map((week, i) =>
              week.days.filter(Boolean).map((day, j) => (
                <td
                  key={`day-num-${i}-${j}`}
                  className={`border border-lightTeal text-[10px] sm:text-[11px] font-medium py-1 text-gray-700 text-center ${getWeekColorClass({
                    index: i,
                    hasExtraStart,
                    hasExtraEnd,
                    totalWeeks,
                  })}`}
                >
                  {day!.getDate()}
                </td>
              ))
            )}
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default TaskTrackerHeader;
