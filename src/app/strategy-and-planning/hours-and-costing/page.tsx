"use client";

// Framework imports:
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// Local imports:
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import { generateStaffTable } from "./lib/generateStaffTable";
import TableComp from "@/components/Table";
import { fetchStaffCount } from "./services/fetchStaffCount";
import { RatioHoursForm } from "./components/RatioHoursForm";
import { PageFilters } from "./components/PageFilters";
import { AddFeeModal } from "./components/AddFeeModal";
import { ADD_ICON } from "@/utils/constants";
import { Accordion } from "./components/Accordion";
import { fetchSiteDropdownOptions, SiteDropdownOption } from "@/services/api/site/fetchSiteDropdownOptions";
import { useRatioAndHours } from "./hooks/useRatioAndHours";
import { NormalizedCosting } from "./types/types";
import { fetchCostingData } from "./services/fetchCostingData";
import { fetchCategoryList } from "./services/fetchCategoryList";
import { getAgeGroupList } from "./services/fetchAgeGroupList";
import { normalizeCostingData } from "./lib/normalizeCostingData";
import { generateCostingTableColumns } from "./lib/generateCostingTableColumns";
import { staffHoursColumns } from "./components/StaffHourColumns";
import NoDataBanner from "@/components/NoDataBanner";
import {
  addRatioAndHours,
  updateRatioAndHours,
} from "@/services/api/strategyAndPlanning/hoursAndCosting";
import AddIcon from "@/utils/AddIcon";

function Page() {
  const router = useRouter();
  const [isAddFeeModalOpen, setIsAddModalOpen] = useState(false);
  const [siteOptions, setSiteOptions] = useState<SiteDropdownOption[]>([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [costingTableData, setCostingTableData] = useState<NormalizedCosting[]>(
    [],
  );
  const [ageGroupColumns, setAgeGroupColumns] = useState<string[]>([]);
  const [staffHoursConfig, setStaffHoursConfig] = useState({
    staffCount: 0,
    ratio: 0,
    hoursPerDay: 0,
  });

  const staffHoursData = generateStaffTable(staffHoursConfig);

  const {
    data,
    isLoading,
    refetch: refetchRatioHours,
  } = useRatioAndHours(selectedSite);

  const ratioID = data?.responsePacket?.[0]?.id || null;
  const isEditable = data?.responsePacket?.length !== 0;

  async function handleRatioHoursSubmit() {
    const payload = {
      childrenPerStaff: String(staffHoursConfig.ratio),
      workingHoursPerDay: String(staffHoursConfig.hoursPerDay),
      siteID: selectedSite,
    };

    if (!ratioID) {
      await addRatioAndHours(payload);
    } else {
      await updateRatioAndHours(ratioID, payload);
    }

    await refetchRatioHours();
  }

  async function loadSiteOptions() {
    const options = await fetchSiteDropdownOptions();
    setSiteOptions(options);

    if (options.length > 0) {
      const firstSiteId = options[0].value;
      setSelectedSite(firstSiteId);
    }
  }

  async function loadStaffHoursConfig() {
    const staffCount = await fetchStaffCount(selectedSite);

    let ratio = 0;
    let hoursPerDay = 0;

    // Use the latest data:
    const { data } = await refetchRatioHours();

    if (data?.responsePacket?.length > 0) {
      ratio = data.responsePacket[0]?.childrenPerStaff ?? 0;
      hoursPerDay = data.responsePacket[0]?.workingHoursPerDay ?? 0;
    }

    setStaffHoursConfig({
      staffCount,
      ratio,
      hoursPerDay,
    });
  }

  async function initializeCostingTable() {
    const [costingData, categoryList, ageGroups] = await Promise.all([
      fetchCostingData(selectedSite),
      fetchCategoryList(),
      getAgeGroupList(selectedSite),
    ]);

    const tableData = normalizeCostingData(
      costingData,
      categoryList,
      ageGroups,
    );

    setCostingTableData(tableData);
    setAgeGroupColumns(ageGroups);
  }

  useEffect(() => {
    loadSiteOptions();
  }, []);

  useEffect(() => {
    if (selectedSite === "") return;

    loadStaffHoursConfig();
    initializeCostingTable();
  }, [selectedSite]);

  return (
    <main className="bg-offWhite min-h-[calc(100vh-72px)] p-6 overflow-auto">
      <article className="bg-white w-full min-h-[calc(100vh-120px)] rounded-2xl p-6 flex flex-col">
        {/*++++++++++++++ Searchbar + SiteDropdown + Reset ++++++++++++++  */}
        <PageHeader title="Hours & Costing">
          <PageFilters
            siteOptions={siteOptions}
            selectedSite={selectedSite}
            setSelectedSite={setSelectedSite}
          />
        </PageHeader>
        <section className="mb-3">
          {staffHoursConfig.staffCount === 0 ? (
            <NoDataBanner bannerText="There are no staff members assigned to this site.">
              <Button
                onClick={() => {
                  router.push(`/staff-management/add-staff/0`);
                }}
                className="h-11 inline-flex items-center gap-2 text-sm bg-slateGreen hover:bg-slateGreen hover:brightness-90"
              >
                <AddIcon />
                Add Staff
              </Button>
            </NoDataBanner>
          ) : (
            <>
              {/*++++++++++++++ Ratio + Hours/day Form ++++++++++++++  */}
              <RatioHoursForm
                values={staffHoursConfig}
                isEditable={isEditable}
                onSubmit={handleRatioHoursSubmit}
                onChange={(updatedValues) => {
                  setStaffHoursConfig((prev) => ({
                    ...prev,
                    ...updatedValues,
                  }));
                }}
              />

              {/*++++++++++++++ Staff Hours Table ++++++++++++++  */}
              <Accordion title="Staff Hours" defaultOpen={true}>
                <TableComp data={staffHoursData} columns={staffHoursColumns} />
              </Accordion>
            </>
          )}
        </section>
        {/*++++++++++++++ Add Fee Modal ++++++++++++++  */}
        <section>
          <div className="flex flex-row justify-end mb-3">
            <Button
              className="h-11 px-6 hover:bg-peach bg-peach hover:brightness-90 "
              onClick={() => {
                setIsAddModalOpen(true);
              }}
            >
              <div className="flex flex-row gap-2">
                <Image src={ADD_ICON} alt="Add icon" height={15} width={15} />
                Add
              </div>
            </Button>

            <AddFeeModal
              open={isAddFeeModalOpen}
              onOpenChange={setIsAddModalOpen}
              selectedSiteId={selectedSite}
              refetchData={initializeCostingTable}
            />
          </div>

          {/*++++++++++++++ Accordion For Costing Table ++++++++++++++  */}
          <Accordion title="Hours/Day" defaultOpen={true}>
            <TableComp
              data={costingTableData}
              columns={generateCostingTableColumns(ageGroupColumns)}
            />
          </Accordion>
        </section>
      </article>
    </main>
  );
}
export default Page;
