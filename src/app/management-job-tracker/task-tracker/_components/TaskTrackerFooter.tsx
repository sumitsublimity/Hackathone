"use client";

import React from "react";
import {
  TaskTrackerFooterProps,
} from "@/utils/interface";
import { getWeeksInMonth } from "@/utils/getWeeksInMonth";
import { getWeekColorClass, getWeekWidthStyle } from "./trackerCont";

const TaskTrackerFooter = ({
  selectedMonth,
  selectedYear,
  data,
  localStatuses,
}: TaskTrackerFooterProps) => {
  const { fullWeeks, extraStartWeek, extraEndWeek } = getWeeksInMonth(
    selectedMonth,
    selectedYear
  );

  const allWeeks = [
    ...(extraStartWeek ? [extraStartWeek] : []),
    ...fullWeeks,
    ...(extraEndWeek ? [extraEndWeek] : []),
  ];

  const totalWeeks = allWeeks.length;
  const hasExtraStart = !!extraStartWeek;
  const hasExtraEnd = !!extraEndWeek;

  const renderRow = (
    label: string,
    type: "total" | "completed" | "notCompletedRatio"
  ) => (
    <tr>
      <td className="text-slateGreen text-right text-xs min-w-[120px] w-[120px] sm:w-[160px] px-2 py-1 bg-white font-normal border border-lightTeal">
        {label}
      </td>
      {allWeeks.map((week, i) => {
        const validDays = week.days.filter(Boolean);
        const weekStyle = getWeekWidthStyle({
          week,
          index: i,
          hasExtraStart,
          hasExtraEnd,
          totalWeeks,
        });

        return validDays.map((day, j) => {
          const dateStr = day!.toDateString();
          const totalTasks = data.length;
          let completedCount = 0;

          // Use localStatuses first if available
          data.forEach((task) => {
            const key = `${task._id}-${dateStr}`;
            const isChecked =
              localStatuses[key] ??
              task.status.some(
                (s) => new Date(s.date).toDateString() === dateStr && s.status === "Completed"
              );

            if (isChecked) completedCount++;
          });

          const notCompleted = totalTasks - completedCount;
          let display = "-";

          if (type === "total") {
            display = String(totalTasks);
          } else if (type === "completed") {
            display = String(completedCount);
          } else if (type === "notCompletedRatio" && totalTasks > 0) {
            const percentage = Math.round((notCompleted / totalTasks) * 100);
            display = `${percentage}%`;
          }

          return (
            <td
              key={`${label}-${i}-${j}`}
              className={`text-slateGreen text-center text-xs border border-lightTeal ${getWeekColorClass({
                index: i,
                hasExtraStart,
                hasExtraEnd,
                totalWeeks,
              })}`}
              style={{
                width: `calc(${weekStyle.width} / ${validDays.length})`,
                minWidth: `calc(${weekStyle.minWidth} / ${validDays.length})`,
              }}
            >
              {display}
            </td>
          );
        });
      })}
    </tr>
  );

  return (
    <div className="mt-4">
      <table className="min-w-full w-fit border-collapse table-fixed">
        <tfoot>
          {renderRow("Total Tasks", "total")}
          {renderRow("Completed Tasks", "completed")}
          {renderRow("Not Completed (%)", "notCompletedRatio")}
        </tfoot>
      </table>
    </div>
  );
};

export default TaskTrackerFooter;
