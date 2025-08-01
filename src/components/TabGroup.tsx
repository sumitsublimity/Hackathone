import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Table from "@/components/Table";
import { TabGroupProps } from "@/utils/interface";
import Pagination from "./Pagination";
import DropdownField from "./DropdownField";
import { ENTRIES_OPTIONS } from "@/app/management-job-tracker/goals/_components/constants";

const TabGroup = (props: TabGroupProps) => {
  const {
    columns,
    currentTab,
    activeTabName,
    inactiveTabName,
    setCurrentTab,
    activeData,
    inactiveData,
    activeFilters,
    setActiveFilters,
    inactiveFilters,
    setInactiveFilters,
    searchFilters,
    handleEntriesCountChange,
  } = props;

  const totalActiveStaffPages = Math.ceil(
    (activeData?.totalItems || 0) / activeFilters.size,
  );

  const totalInactiveStaffPages = Math.ceil(
    (inactiveData?.totalItems || 0) / inactiveFilters.size,
  );

  const currentPageIndex =
    currentTab === "active" ? activeFilters.page : inactiveFilters.page;

  const currentTotalPages =
    currentTab === "active" ? totalActiveStaffPages : totalInactiveStaffPages;

  const currentPageChangeHandler =
    currentTab === "active"
      ? (newPage: number) =>
          setActiveFilters((prev) => ({
            ...prev,
            page: newPage,
          }))
      : (newPage: number) =>
          setInactiveFilters((prev) => ({
            ...prev,
            page: newPage,
          }));

  return (
    <Tabs
      defaultValue={currentTab}
      onValueChange={setCurrentTab}
      className="w-full gap-0"
    >
      {/* ++++++++++++++ Active/Inactive Tab Buttons: ++++++++++++++ */}
      <TabsList className="grid  gap-2 grid-cols-2 bg-transparent m-0  w-full sm:w-fit p-0">
        <TabsTrigger
          value="active"
          className="!bg-peach !text-white data-[state=inactive]:!bg-transparent data-[state=inactive]:!text-peach !border-peach rounded-t-md px-4 mb-[-1px] border-b-0 rounded-b-none w-full py-3"
        >
          {activeTabName}
        </TabsTrigger>
        <TabsTrigger
          value="inactive"
          className="!bg-transparent !text-peach data-[state=active]:!bg-peach data-[state=active]:!text-white !border-peach rounded-t-md px-4 mb-[-1px] border-b-0 rounded-b-none w-full py-3"
        >
          {inactiveTabName}
        </TabsTrigger>
      </TabsList>
      <div className="border-b w-full border-peach mb-5"></div>

      {/* ++++++++++++++ Active Staff Content: ++++++++++++++ */}
      <TabsContent value="active">
        <Table data={activeData?.data || []} columns={columns} />
      </TabsContent>

      {/* ++++++++++++++ Inactive Staff Content: ++++++++++++++ */}
      <TabsContent value="inactive">
        <Table data={inactiveData?.data || []} columns={columns} />
      </TabsContent>

      {currentTotalPages !== 0 && (
        <div className="flex flex-row gap-2 justify-between items-center mt-6">
          {/* ++++++++++++++ Entries Selector Dropdown: ++++++++++++++ */}
          <div className="flex flex-row gap-2 items-center">
            <span className="text-darkGreen">Rows</span>
            <div className="min-w-20">
              <DropdownField
                className="min-w-20"
                contentClassName="min-w-20"
                name="size"
                value={String(searchFilters.size)}
                options={ENTRIES_OPTIONS}
                onChange={(name, value) => {
                  handleEntriesCountChange(value);
                }}
              />
            </div>
          </div>
          {/* ++++++++++++++ Pagination: ++++++++++++++ */}
          <Pagination
            pageIndex={currentPageIndex}
            totalPages={currentTotalPages}
            onPageChange={currentPageChangeHandler}
          />
        </div>
      )}
    </Tabs>
  );
};
export default TabGroup;
