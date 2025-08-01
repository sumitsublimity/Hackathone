"use client";

import Button from "@/components/Button";
import DropdownField from "@/components/DropdownField";
import PageHeader from "@/components/PageHeader";
import { months } from "@/utils/constants";
import { getFiveYearOptions } from "@/utils/yearUtils";

import Reset from "@/../public/icons/reset.svg";
import SearchIcon from "@/../public/icons/Search.svg";
import { Input } from "@/components/ui/input";
import { fetchSiteDropdownOptions, SiteDropdownOption } from "@/services/api/site/fetchSiteDropdownOptions";
import AddIcon from "@/utils/AddIcon";
import { format } from "date-fns"; // ✅ current v2+ usage
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AccordionBox from "./_components/AccordianBox";
import AddForm from "./_components/AddForm";

const Page = () => {
  const { yearOptions, currentYear } = useMemo(() => getFiveYearOptions(), []);
  const [onYearChange, setOnYearChange] = useState(currentYear);
  const [isAddHoursSoldModalOpen, setIsAddHoursSoldModalOpen] = useState(false);

  const [siteOption, setSiteOption] = useState<SiteDropdownOption[]>([]);
  const [changeSiteValue, setChangeSiteValue] = useState<{ name: string, value: string }>({ name: "", value: "" });
  const [changeMonth, setChangeMonth] = useState("");
  const [SiteAgeGroup, setSiteAgeGroup] = useState<string[]>([]);
  const [siteData, setSiteData] = useState<SiteDropdownOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const site = await fetchSiteDropdownOptions();
      setSiteData(site);
      const ageGroup1 = site.find((item: SiteDropdownOption) => item.value === site[0].value);
      if (ageGroup1 && ageGroup1.ageGroup) {
        setSiteAgeGroup(ageGroup1.ageGroup as string[]);
      } else {
        setSiteAgeGroup([]);
      }
      setSiteOption(site);
      setChangeSiteValue({
        name: site[0].label,
        value: site[0].value,
      });

      const currentMonth = format(new Date(), "MMMM");
      setChangeMonth(currentMonth);
    };
    fetchData();
  }, []);

  const handleDropdownChange = (name: string, value: string) => {
    setChangeSiteValue({ name, value });

    const ageGroup1 = siteData.find((item: SiteDropdownOption) => item.value === value);
    if (ageGroup1 && ageGroup1.ageGroup) {
      setSiteAgeGroup(ageGroup1.ageGroup as string[]);
    } else {
      setSiteAgeGroup([]);
    }
  };
  const handleMonthChange = (name: string, value: string) => {
    setChangeMonth(value);
  };

  const resetFilers = () => {
    if (siteOption.length > 0) {
      setChangeSiteValue({
        name: siteOption[0].label,
        value: siteOption[0].value,
      });
    }
    setOnYearChange(currentYear);
    const currentMonth = format(new Date(), "MMMM");
    setChangeMonth(currentMonth);
  };
  function handleDialogOpenChange(isOpen: boolean) {
    setIsAddHoursSoldModalOpen(isOpen);
  }

  return (
    <main className="bg-offWhite min-h-[calc(100vh-72px)] p-6 overflow-auto">
      <article className="bg-white w-full min-h-[calc(100vh-120px)] rounded-2xl p-6 flex flex-col">
        <PageHeader title="Hours Sold">
          <div className="flex items-center gap-2 ">
            <div className="flex items-center border border-lightTeal rounded-md px-3 py-1 bg-white shadow-sm w-44">
              <Image
                src={SearchIcon}
                alt="Edit task icon."
                className="cursor-pointer"
              />
              <Input
                type="text"
                placeholder="Search..."
                className="ml-2 shadow-none h-9 w-full text-sm text-gray-700 bg-transparent placeholder-lightTeal border-0 outline-none focus:outline-none focus:!ring-0 focus:!border-0"
              />
            </div>

            <div className="w-36">
              <DropdownField
                name="siteID"
                placeholder="Select Site"
                options={siteOption || []}
                value={changeSiteValue?.value}
                onChange={handleDropdownChange}
                height="h-12"
              />
            </div>
            <div className="w-28">
              <DropdownField
                name="month"
                placeholder="Select month"
                className=""
                value={changeMonth}
                onChange={handleMonthChange}
                options={months.map((m) => ({ value: m, label: m }))}
                contentClassName="w-[15vw]"
                height="h-12"
              />
            </div>

            <DropdownField
              name="year"
              value={onYearChange.toString()}
              onChange={(_, val) => setOnYearChange(val)}
              options={yearOptions}
              className="min-w-[110px] max-w-[110px]"
              contentClassName="min-w-[110px] max-w-[110px]"
              height="h-12"
            />

            <div className="h-full">
              {/* <AddBudgetModal
                triggerType="add"
                onSubmit={(data) => {
                }}
                year={onYearChange.toString()}
              /> */}
              <Button
                className=" inline-flex h-12 items-center gap-2 text-sm bg-skyBlue hover:bg-skyBlue hover:brightness-90"
                onClick={resetFilers}
              >
                <Image src={Reset} alt="Export" className="text-white" />
                Reset
              </Button>
            </div>
            <AddForm
              title={"Add Hours Sold"}
              btn={
                <Button className=" h-12 inline-flex items-center gap-2 text-sm bg-peach hover:bg-peach hover:brightness-90">
                  <AddIcon />
                  Add
                </Button>
              }
              siteAgeGroup={SiteAgeGroup}
              changeSiteId={changeSiteValue.value}
            />
          </div>
        </PageHeader>
        <div>
          <AccordionBox
            SiteAgeGroup={SiteAgeGroup}
            changeSiteId={changeSiteValue.value}
            data={{
              site: changeSiteValue.value,
              month: changeMonth,
              year: onYearChange,
            }}
          />
        </div>
      </article>
    </main>
  );
};

export default Page;
