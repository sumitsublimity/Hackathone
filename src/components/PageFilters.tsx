import Image from "next/image";
import Button from "./Button";
import DropdownField from "./DropdownField";
import { EXPORT_ICON, IMPORT_ICON, RESET_ICON } from "@/utils/constants";

interface PageFiltersProps {
  siteOptions: { label: string; value: string }[];
  yearOptions: { label: string; value: string }[];
  selectedSiteID: string;
  selectedYear: string;
  onSiteChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onReset: () => void;
  onImport?: () => void;
  onExport?: () => void;
}

export function PageFilters(props: PageFiltersProps) {
  const {
    siteOptions,
    yearOptions,
    selectedSiteID,
    selectedYear,
    onSiteChange,
    onYearChange,
    onReset,
    onImport,
    onExport,
  } = props;

  return (
    <div className="flex flex-col sm:flex-row sm:justify-end gap-2 w-full lg:w-fit">
      {/*++++++++++++++ Site Dropdown ++++++++++++++*/}
      <DropdownField
        name="siteID"
        className="flex-1 sm:min-w-38 sm:max-w-38"
        options={siteOptions}
        value={selectedSiteID}
        onChange={(name, value) => {
          onSiteChange(value);
        }}
      />
      {/*++++++++++++++ Year Dropdown ++++++++++++++*/}
      <DropdownField
        name="year"
        contentClassName="min-w-20"
        options={yearOptions}
        value={selectedYear}
        onChange={(name, value) => {
          onYearChange(value);
        }}
      />
      <div className="flex flex-row flex-wrap gap-2 sm:flex-nowrap  md:justify-end">
        {/*++++++++++++++ Reset Button ++++++++++++++*/}
        <Button
          onClick={onReset}
          className="h-11 min-w-28 w-full md:max-w-28 sm:flex-1 px-4 bg-skyBlue hover:bg-skyBlue hover:brightness-90 cursor-pointer"
        >
          <div className="flex flex-row gap-2">
            <Image src={RESET_ICON} alt="Add icon" height={15} width={15} />
            Reset
          </div>
        </Button>
        {/*++++++++++++++ Import Button ++++++++++++++*/}
        <Button
          className="h-11 min-w-28 w-full md:max-w-28  sm:flex-1 px-4 bg-darkGreen hover:bg-darkGreen hover:brightness-120 cursor-pointer"
          onClick={onImport}
        >
          <div className="flex flex-row gap-2">
            <Image src={IMPORT_ICON} alt="Import icon" height={15} width={15} />
            Import
          </div>
        </Button>
        {/*++++++++++++++ Export Button ++++++++++++++*/}
        <Button
          className="h-11 min-w-28 w-full md:max-w-28 sm:flex-1 px-4 bg-coffee hover:bg-coffee hover:brightness-90 cursor-pointer"
          onClick={onExport}
        >
          <div className="flex flex-row gap-2">
            <Image src={EXPORT_ICON} alt="Export icon" height={15} width={15} />
            Export
          </div>
        </Button>
      </div>
    </div>
  );
}
