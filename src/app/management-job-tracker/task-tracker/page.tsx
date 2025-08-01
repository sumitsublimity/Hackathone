"use client";

import React, { useState, useMemo, useEffect } from "react";
import SectionTitle from "@/components/SectionTitle";
import { MonthYearPicker } from "./_components/trackerCont";
import TaskTrackerHeader from "./_components/TaskTrackerHeader";
import TaskTrackerBody from "./_components/TaskTrackerBody";
import { useQuery } from "@tanstack/react-query";
import { SiteGoalData, Subgoal } from "@/utils/interface";
import { getGoaltrackerData } from "@/services/api/jobTracker";
import TaskTrackerFooter from "./_components/TaskTrackerFooter";
import Image from "next/image";
import addGoalBanner from "@/../public/logo/add-goal-banner.svg";
// import TaskTrackerFooter from "./_components/TaskTrackerFooter";

const Page = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedSiteID, setSelectedSiteID] = useState<string>("");
  const [localStatuses, setLocalStatuses] = useState<Record<string, boolean>>(
    {},
  );
  const [localStatusIdMap, setLocalStatusIdMap] = useState<
    Record<string, string>
  >({});

  // Date range for the API
  const startDate = new Date(selectedYear, selectedMonth, 1)
    .toISOString()
    .split("T")[0];
  const endDate = new Date(selectedYear, selectedMonth + 1, 0)
    .toISOString()
    .split("T")[0];

  const {
    data: goalData = [],
    isLoading,
    refetch,
    isError,
  } = useQuery<SiteGoalData[]>({
    queryKey: [
      "goalTrackerData",
      startDate,
      endDate,
      selectedSiteID,
      selectedYear,
    ],
    queryFn: () =>
      getGoaltrackerData({
        startDate,
        endDate,
        siteID: selectedSiteID,
        year: String(selectedYear),
      }),
    enabled: !!selectedSiteID,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (selectedSiteID) {
      refetch();
    }
  }, [selectedMonth, selectedYear, selectedSiteID]);

  const noGoals = useMemo(
    () =>
      !isLoading &&
      !isError &&
      (!goalData[0]?.subGoals || goalData[0].subGoals.length === 0),
    [goalData, isLoading, isError],
  );

  return (
    <div className="w-full bg-[var(--bg-lightGray)] overflow-y-auto">
      <div className="rounded-xl p-5 gap-6 m-6 mb-0 bg-[var(--background)]">
        {/* Header Section */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4 mb-4 border-[var(--font-slate)]">
          <SectionTitle title="Task Tracker" className="border-0 w-fit" />
          <MonthYearPicker
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedSiteID={selectedSiteID}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            onSiteChange={setSelectedSiteID}
          />
        </div>

        {/* Chart Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-fit">
            {noGoals ? (
              <div className="flex justify-center items-center py-10">
                <section className="bg-offWhite min-h-1/2 w-1/2 rounded-2xl p-6 flex flex-col items-center gap-2">
                  <div className="object-contain h-full w-full flex flex-col items-center justify-center">
                    <Image
                      src={addGoalBanner}
                      alt="Add goals banner"
                      width={100}
                      height={100}
                    />
                  </div>
                  <h2 className="text-lg text-peach font-medium">
                    There are no goals
                  </h2>
                </section>
              </div>
            ) : (
              <>
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 bg-[var(--background)]">
                  <TaskTrackerHeader
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    siteLogo={goalData[0]?.siteLogo}
                    data={goalData[0]?.subGoals || []}
                    localStatuses={localStatuses}
                  />
                </div>

                {/* Scrollable Body */}
                <div className="max-h-[65vh] overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-gray-500">
                      Loading task data...
                    </div>
                  ) : isError ? (
                    <div className="p-4 text-red-500">
                      Failed to load task data
                    </div>
                  ) : (
                    <TaskTrackerBody
                      selectedMonth={selectedMonth}
                      selectedYear={selectedYear}
                      data={goalData[0]?.subGoals || []}
                      localStatuses={localStatuses}
                      setLocalStatuses={setLocalStatuses}
                      localStatusIdMap={localStatusIdMap}
                      setLocalStatusIdMap={setLocalStatusIdMap}
                    />
                  )}
                </div>

                {/* Sticky Footer */}
                <div className="sticky bottom-0 z-10 bg-[var(--background)]">
                  <TaskTrackerFooter
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    data={goalData[0]?.subGoals || []}
                    localStatuses={localStatuses}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
