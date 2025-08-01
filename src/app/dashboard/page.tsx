"use client";
import { Calendar } from "@/components/ui/calendar";
import StatsCard from "@/components/StatsCard";

import DropdownCard from "@/components/DropdownCard";
import React from "react";
import { BarChartHolder } from "@/components/BarChartHolder";
import ProgressCard from "@/components/ProgressCard";
import { CardWrapper } from "@/components/CardWrapper";
import DoughnutChart from "@/components/DoughnutChart";
import StaffTurnoverGauge from "@/components/GaugeMeter";
import { MaintenanceChart } from "@/components/MaintenanceChart";
import { AccidentReportChart } from "@/components/AccidentReportChart";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <>
      {/*++++++++++++++ Section: Main Container ++++++++++++++  */}
      <article className="flex flex-row gap-6 p-6 overflow-auto ">
        {/*++++++++++++++ Section: Left Container ++++++++++++++  */}
        <article className="flex flex-col gap-6 flex-[9]">
          {/*++++++++++++++ Section: Statistics Cards ++++++++++++++  */}
          <article className="flex flex-row gap-6 bg-offWhite">
            <StatsCard
              title="Total Cost Per Hour"
              description={
                "Clear cost per hour, flag if >target. Click to see breakdown (staff, food, overhead)"
              }
              footerLeftText="7,265"
              footerRightText="+11.5%"
              iconPath="/icons/ArrowRise.svg"
              cardClassName="bg-iceBlue"
            />
            <StatsCard
              title="Consumable Charge"
              description={
                "Monthly avg. charged. Tooltip: total consumables revenue vs cost."
              }
              footerLeftText="3,671"
              footerRightText="-0.03%"
              iconPath="/icons/ArrowFall.svg"
              cardClassName="bg-lightPink"
            />
            <StatsCard
              title="Cost Per Meal"
              description={
                "Monthly avg. meal cost. Optional: sparkline trend over 3 months."
              }
              footerLeftText="156"
              footerRightText="+15.03%"
              iconPath="/icons/ArrowRise.svg"
              cardClassName="bg-greenishGray"
            />
          </article>

          {/*++++++++++++++ Section: Job Tracker + Dropdown ++++++++++++++  */}
          <article className="flex flex-row gap-6 w-full ">
            {/*++++++++++++++ Section: Job Track Chart ++++++++++++++  */}
            <div className="flex-[3]">
              <BarChartHolder />
            </div>

            {/*++++++++++++++ Section: DropdownCard ++++++++++++++  */}
            <article className="flex flex-col gap-3 flex-[2]">
              <DropdownCard
                placeholder="Select Action"
                title={"Opening Checks"}
              />
              <DropdownCard
                placeholder="Further Action"
                title={"Closing Checks"}
              />
            </article>
          </article>

          {/*++++++++++++++ Section: Maintenance Request + Staff Complaint + Staff to turnover ratio ++++++++++++++  */}
          <article className="flex flex-row gap-3">
            {/*++++++++++++++ Section: Maintenance Request Card ++++++++++++++  */}
            <CardWrapper title={"Maintenance Request"}>
              <MaintenanceChart />
            </CardWrapper>

            {/*++++++++++++++ Section: Staff Complaint/Policies ++++++++++++++  */}
            <CardWrapper title={"Staff Complaint/Policies"}>
              <StaffTurnoverGauge description="% of team with all compliance items completed (induction, policies)" />
            </CardWrapper>

            {/*++++++++++++++ Section: Staff to Turnover Ratio ++++++++++++++  */}
            <CardWrapper title={"Staff to Turnover Ratio"}>
              <DoughnutChart />
            </CardWrapper>
          </article>

          {/*++++++++++++++ Section: Progress Card ++++++++++++++  */}
          <article className="flex flex-row gap-3 shadow bg-white p-4 rounded-2xl">
            <ProgressCard
              title={"Cash Collected"}
              progressBarClassName={"bg-darkGreen"}
              numerator={8}
              denominator={15}
            />
            <ProgressCard
              title={"Occupancy"}
              progressBarClassName={"bg-coffee"}
              numerator={15}
              denominator={45}
            />
            <ProgressCard
              title={"Lead Conversion"}
              progressBarClassName={"bg-peach"}
              numerator={55}
              denominator={100}
            />
          </article>
        </article>

        {/*++++++++++++++ Section: Right Container ++++++++++++++  */}
        <article className="flex-[1] flex flex-col gap-6">
          {/*++++++++++++++ Section: Calendar ++++++++++++++  */}
          <article>
            <Calendar
              captionLayout="label"
              mode="single"
              navLayout="after"
              className="rounded-2xl shadow"
              classNames={{
                today: "bg-peach text-white shadow rounded-full",
              }}
            />
          </article>
          {/*++++++++++++++ Section: NPS Score ++++++++++++++  */}
          <CardWrapper title={"NPS Score"}>
            <div className="mt-3">
              <Image
                src="/icons/nps-score.svg"
                width={305}
                height={45}
                alt="nps score"
              />
            </div>
            <div className="mt-3">
              <Image
                src="/icons/nps-slider.svg"
                width={305}
                height={16}
                alt="nps slider"
              />
            </div>
          </CardWrapper>
          {/*++++++++++++++ Section: Staff Complaint DBS ++++++++++++++  */}
          <CardWrapper title={"Staff Complaint DBS"}>
            <StaffTurnoverGauge description={"% of staff with in-date DBS"} />
          </CardWrapper>
          {/*++++++++++++++ Section: Accident Reports ++++++++++++++  */}
          <CardWrapper title={"Accident Reports"}>
            <AccidentReportChart />
            <p>% of staff with in-date DBS (3 years)</p>
          </CardWrapper>
        </article>
      </article>
    </>
  );
}
