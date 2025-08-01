"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Subgoal,
  OccuranceType,
  TaskTrackerBodyProps,
} from "@/utils/interface";
import {
  formatDateLocal,
  getWeekColorClass,
  getWeekWidthStyle,
} from "./trackerCont";
import {
  taskStatusCompleted,
  removeTaskStatus,
} from "@/services/api/jobTracker";
import { showToast } from "@/utils/alert";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import { getWeeksInMonth } from "@/utils/getWeeksInMonth";

const sectionLabels: Record<OccuranceType, string> = {
  morning: "Morning",
  day: "Day",
  evening: "Evening",
};

const getCheckboxKey = (subgoalId: string, date: Date) =>
  `${subgoalId}-${new Date(date).toDateString()}`;

const TaskTrackerBody = ({
  selectedMonth,
  selectedYear,
  data,
  localStatuses,
  setLocalStatuses,
  localStatusIdMap,
  setLocalStatusIdMap,
}: TaskTrackerBodyProps & {
  localStatusIdMap: Record<string, string>;
  setLocalStatusIdMap: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}) => {
  const [collapsed, setCollapsed] = useState<Record<OccuranceType, boolean>>({
    morning: false,
    day: false,
    evening: false,
  });

  const [checkboxLoading, setCheckboxLoading] = useState<
    Record<string, boolean>
  >({});
  const initializedRef = useRef(false);

  const { fullWeeks, extraStartWeek, extraEndWeek } = getWeeksInMonth(
    selectedMonth,
    selectedYear,
  );
  const allWeeks = [
    ...(extraStartWeek ? [extraStartWeek] : []),
    ...fullWeeks,
    ...(extraEndWeek ? [extraEndWeek] : []),
  ];

  const totalWeeks = allWeeks.length;
  const hasExtraStart = !!extraStartWeek;
  const hasExtraEnd = !!extraEndWeek;

  // Initialize checkboxes on first render
  useEffect(() => {
    if (!data.length) return;

    const newStatuses: Record<string, boolean> = {};
    const newStatusIdMap: Record<string, string> = {};

    data.forEach((task) => {
      task.status?.forEach((status) => {
        const date = new Date(status.date);
        const key = getCheckboxKey(task._id, date);
        if (status.status === "Completed") {
          newStatuses[key] = true;
          newStatusIdMap[key] = status._id;
        }
      });
    });

    setLocalStatuses(newStatuses);
    setLocalStatusIdMap(newStatusIdMap);
  }, [data]);

  // Group subgoals by period
  const groupedTasks: Record<OccuranceType, Subgoal[]> = {
    morning: [],
    day: [],
    evening: [],
  };

  data.forEach((task) => {
    const periodKey = task.period?.toLowerCase?.() as OccuranceType;
    if (groupedTasks[periodKey]) {
      groupedTasks[periodKey].push(task);
    }
  });

  const toggleCollapse = (key: OccuranceType) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleCheckboxToggle = async (
    task: Subgoal,
    date: Date,
    checkboxKey: string,
    isChecked: boolean,
  ) => {
    setCheckboxLoading((prev) => ({ ...prev, [checkboxKey]: true }));
    const dateISO = formatDateLocal(date);
    const statusId = localStatusIdMap[checkboxKey];

    try {
      if (!isChecked) {
        const res = await taskStatusCompleted({
          subgoal_id: task._id,
          date: dateISO,
          status: "Completed",
        });
        if (res?.success && res?.responsePacket?._id) {
          const newStatusId = res.responsePacket._id;
          setLocalStatuses((prev) => ({ ...prev, [checkboxKey]: true }));
          setLocalStatusIdMap((prev) => ({
            ...prev,
            [checkboxKey]: newStatusId,
          }));
        } else {
          throw new Error("Invalid response");
        }
      } else {
        if (!statusId) {
          showToast("Cannot uncheck — status ID not found.", ALERT_TYPES.ERROR);
          return;
        }
        const res = await removeTaskStatus([statusId]);
        if (res?.success) {
          setLocalStatuses((prev) => ({ ...prev, [checkboxKey]: false }));
          setLocalStatusIdMap((prev) => {
            const updated = { ...prev };
            delete updated[checkboxKey];
            return updated;
          });
        }
      }
    } catch (err) {
      console.error("Checkbox update error:", err);
      showToast(MESSAGES.SOMETHING_WENT_WRONG, ALERT_TYPES.ERROR);
    } finally {
      setCheckboxLoading((prev) => ({ ...prev, [checkboxKey]: false }));
    }
  };

  return (
    <div
      className="border-t border-lightTeal overflow-y-auto max-h-[200px] "
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="min-w-fit overflow-hidden" style={{ overflow: "hidden" }}>
        <table className="min-w-full w-fit table-fixed border-collapse">
          <thead>
            <tr className="invisible h-0 p-0">
              <th className="w-[120px] h-0 p-0 min-w-[120px]  sm:w-[160px]" />
              {allWeeks.map((week, i) => (
                <th
                  key={`week-header-${i}`}
                  colSpan={week.days.filter(Boolean).length}
                  className={`h-0 p-0 ${getWeekColorClass({
                    index: i,
                    hasExtraStart,
                    hasExtraEnd,
                    totalWeeks,
                  })}`}
                  style={getWeekWidthStyle({
                    week,
                    index: i,
                    hasExtraStart,
                    hasExtraEnd,
                    totalWeeks,
                  })}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedTasks).map(([period, tasks]) => {
              const section = period as OccuranceType;
              if (!tasks.length) return null;

              return (
                <React.Fragment key={section}>
                  {/* Section Header Row */}
                  <tr>
                    <td
                      colSpan={
                        1 +
                        allWeeks.reduce(
                          (sum, w) => sum + w.days.filter(Boolean).length,
                          0,
                        )
                      }
                      className="bg-offWhite border-x border-b border-lightTeal text-slateGreen font-semibold text-base py-1 px-3 cursor-pointer"
                      onClick={() => toggleCollapse(section)}
                    >
                      {sectionLabels[section]} {collapsed[section] ? "▸" : "▾"}
                    </td>
                  </tr>

                  {/* Subgoal Task Rows */}
                  {!collapsed[section] &&
                    tasks.map((task) => (
                      <tr key={task._id}>
                        <td className="bg-white border border-lightTeal px-2 py-1 text-xs text-slateGreen w-[160px] min-w-[160px] max-w-[160px] truncate">
                          {task.name}
                        </td>

                        {allWeeks.flatMap((week, i) =>
                          week.days.filter(Boolean).map((day) => {
                            const checkboxKey = getCheckboxKey(task._id, day!);
                            const isChecked =
                              localStatuses[checkboxKey] ?? false;

                            return (
                              <td
                                key={checkboxKey}
                                className={`border border-lightTeal text-center ${getWeekColorClass(
                                  {
                                    index: i,
                                    hasExtraStart,
                                    hasExtraEnd,
                                    totalWeeks,
                                  },
                                )}`}
                                style={{
                                  width: `calc(100% / ${week.days.length})`,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  disabled={checkboxLoading[checkboxKey]}
                                  onChange={() =>
                                    handleCheckboxToggle(
                                      task,
                                      day!,
                                      checkboxKey,
                                      isChecked,
                                    )
                                  }
                                />
                              </td>
                            );
                          }),
                        )}
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTrackerBody;
