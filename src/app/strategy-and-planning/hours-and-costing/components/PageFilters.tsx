import DropdownField from "@/components/DropdownField";
import { Button } from "@/components/ui/button";
import { RESET_ICON } from "@/utils/constants";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface PageFiltersProps {
  siteOptions: { label: string; value: string }[];
  selectedSite: string;
  setSelectedSite: (value: string) => void;
}

export const PageFilters = (props: PageFiltersProps) => {
  const { siteOptions, selectedSite, setSelectedSite } = props;
  const initialSiteRef = useRef<string | null>(null);

  const handleReset = () => {
    if (initialSiteRef.current) {
      setSelectedSite(initialSiteRef.current);
    }
  };

  useEffect(() => {
    if (selectedSite !== "" && initialSiteRef.current === null) {
      initialSiteRef.current = selectedSite;
    }
  }, [selectedSite]);

  return (
    <div className="flex flex-row gap-2 flex-wrap lg:flex-nowrap ">
      {/*++++++++++++++ Site Dropdown ++++++++++++++  */}
      <div className="w-full sm:flex-1 lg:min-w-40">
        <DropdownField
          name="siteID"
          className="lg:min-w-40"
          placeholder="Select Site"
          options={siteOptions}
          value={selectedSite}
          onChange={(name, value) => setSelectedSite(value)}
        />
      </div>

      {/*++++++++++++++ Reset Button ++++++++++++++  */}
      <div className="flex flex-row flex-wrap gap-2 w-full sm:flex-nowrap">
        <Button
          className="h-11 w-full sm:flex-1 px-4 bg-skyBlue hover:bg-skyBlue hover:brightness-90 cursor-pointer"
          onClick={handleReset}
        >
          <div className="flex flex-row gap-2">
            <Image src={RESET_ICON} alt="Add icon" height={15} width={15} />
            Reset
          </div>
        </Button>
      </div>
    </div>
  );
};
