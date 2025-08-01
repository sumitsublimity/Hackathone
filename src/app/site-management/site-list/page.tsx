"use client";

// Framework imports:
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
// Libraries imports:
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { ColumnDef } from "@tanstack/react-table";
// Local imports:
import TableActionButtons from "@/components/TableActionButtons";
import TabGroup from "@/components/TabGroup";
import { SearchFilters, SiteTableCols } from "@/utils/interface";
import { getSiteList } from "@/services/api/site/site";
import TableActionBar from "@/components/TableActionBar";
import SectionTitle from "@/components/SectionTitle";
import { fetchDataLoadingState } from "@/redux/slice/dataLoadingSlice";
import { DEFAULT_ENTRIES_COUNT, DEFAULT_PAGE_INDEX } from "@/utils/constants";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSiteFilters, setActiveSiteFilters] = useState<SearchFilters>({
    size: DEFAULT_ENTRIES_COUNT,
    page: DEFAULT_PAGE_INDEX,
    search: "",
    inActive: false,
  });
  const [inactiveSiteFilters, setInactiveSiteFilters] = useState<SearchFilters>(
    {
      size: DEFAULT_ENTRIES_COUNT,
      page: DEFAULT_PAGE_INDEX,
      search: "",
      inActive: true,
    },
  );

  /*++++++++++++++ Query Params For API ++++++++++++++  */
  // Memoized for performance optimization:
  const activeSiteFilterParams = useMemo(() => {
    return {
      size: activeSiteFilters.size,
      page: activeSiteFilters.page,
      search: activeSiteFilters.search,
      inActive: activeSiteFilters.inActive,
    };
  }, [activeSiteFilters]);

  // Memoized for performance optimization:
  const inactiveSiteFilterParams = useMemo(() => {
    return {
      page: inactiveSiteFilters.page,
      size: inactiveSiteFilters.size,
      search: inactiveSiteFilters.search,
      inActive: inactiveSiteFilters.inActive,
    };
  }, [inactiveSiteFilters]);

  /*++++++++++++++ Tanstack Query For Active Site: ++++++++++++++  */
  const {
    data: activeSiteData,
    isLoading: isActiveSiteLoading,
    refetch: activeSiteRefetch,
  } = useQuery({
    queryKey: ["activeSiteList", activeSiteFilterParams],
    queryFn: () => {
      return getSiteList(activeSiteFilterParams);
    },
    retry: false,
  });

  /*++++++++++++++ Tanstack Query For Inactive Site: ++++++++++++++  */
  const {
    data: inactiveSiteData,
    isLoading: isInactiveSiteLoading,
    refetch: inactiveSiteRefetch,
  } = useQuery({
    queryKey: ["inactiveSiteList", inactiveSiteFilterParams],
    queryFn: () => {
      return getSiteList(inactiveSiteFilterParams);
    },
    // Disable automatic fetching:
    enabled: false,
    retry: false,
  });

  // Site List with fallback if data-structure changes:
  const activeSiteList = activeSiteData?.responsePacket?.[0] ?? [];
  const inactiveSiteList = inactiveSiteData?.responsePacket?.[0] ?? [];

  /*++++++++++++++ Column Headers for Tanstack Table: ++++++++++++++  */
  const columns: ColumnDef<SiteTableCols>[] = [
    {
      header: "S.NO",
      size: 50,
      cell: ({ row }) => {
        // Generate 1-based serial number for paginated rows:
        const currentPage =
          currentTab === "active"
            ? activeSiteFilters.page
            : inactiveSiteFilters.page;

        const pageSize =
          currentTab === "active"
            ? activeSiteFilters.size
            : inactiveSiteFilters.size;

        const sno = currentPage * pageSize + row.index + 1;
        return <div className="text-center">{sno}</div>;
      },
    },
    {
      accessorKey: "name",
      size: 400,
      header: "Site Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "siteEmail",
      size: 400,
      header: "Site Email",
      cell: (info) => {
        return info.getValue();
      },
    },
    // Commented out for now may be uncommented later on:
    // {
    //   accessorKey: "email",
    //   header: "Email",
    //   cell: (info) => info.getValue(),
    // },
    // {
    //   accessorKey: "firstName",
    //   header: "First Name",
    //   cell: (info) => info.getValue(),
    // },
    // {
    //   accessorKey: "telephoneNumber",
    //   header: "Tel. No.",
    //   cell: (info) => info.getValue(),
    // },
    // {
    //   accessorKey: "mobileNumber",
    //   header: "Mobile No.",
    //   cell: (info) => info.getValue(),
    // },
    {
      header: "Actions",
      size: 120,
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <TableActionButtons
            data={rowData}
            usedFor={"site"}
            activeDataRefetch={activeSiteRefetch}
            inactiveDataRefetch={inactiveSiteRefetch}
          />
        );
      },
    },
  ];

  function updateFilters(
    type: "active" | "inactive",
    updates: Partial<SearchFilters>,
  ) {
    if (type === "active") {
      setActiveSiteFilters((prev) => ({ ...prev, ...updates }));
    } else {
      setInactiveSiteFilters((prev) => ({ ...prev, ...updates }));
    }
  }

  function handleSearchTermChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  function handleAddSiteClick() {
    router.push("/site-management/add-site/0");
  }

  function handleEntriesCountChange(value: string) {
    const newSize = Number(value);

    updateFilters("active", {
      page: DEFAULT_PAGE_INDEX,
      size: newSize,
    });

    updateFilters("inactive", {
      page: DEFAULT_PAGE_INDEX,
      size: newSize,
    });
  }

  useEffect(() => {
    //Reflects search results only after a brief delay of 500ms from end of user's typing.
    // Added de-bouncing in search field:
    const timeoutId = setTimeout(() => {
      if (currentTab === "active") {
        updateFilters("active", {
          // Reset to first page upon switching:
          page: DEFAULT_PAGE_INDEX,
          search: searchTerm,
        });
      } else if (currentTab === "inactive") {
        updateFilters("inactive", {
          // Reset to first page upon switching:
          page: DEFAULT_PAGE_INDEX,
          search: searchTerm,
        });
      }
    }, 500);

    // Clean-up function:
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  useEffect(() => {
    //Resetting search field and search params on every tab change:
    setSearchTerm("");
    updateFilters("active", { search: "" });
    updateFilters("inactive", { search: "" });
  }, [currentTab]);

  useEffect(() => {
    // // Fetch inactive site list when user visit inactive tab or make changes in inactive filters
    if (currentTab === "inactive") {
      inactiveSiteRefetch();
    }
  }, [inactiveSiteFilters, currentTab]);

  useEffect(() => {
    dispatch(
      fetchDataLoadingState(isInactiveSiteLoading || isActiveSiteLoading),
    );
  }, [isActiveSiteLoading, isInactiveSiteLoading]);

  return (
    <div className="w-full bg-offWhite overflow-auto">
      <div className="rounded-xl p-4 gap-6 m-6 bg-[var(--background)]">
        {/*++++++++++++++ Entries Dropdown, Search Field and Add Site Button ++++++++++++++  */}
        <TableActionBar
          pageTitle="Site List"
          searchTerm={searchTerm}
          onSearch={handleSearchTermChange}
          isButtonRequired={true}
          buttonText="Add Site"
          onButtonClick={handleAddSiteClick}
          clearSearchBar={() => {
            setSearchTerm("");
          }}
        />
        {/*++++++++++++++ Active/Inactive Site List With Pagination ++++++++++++++  */}
        <TabGroup
          columns={columns}
          activeTabName={"Active Site"}
          inactiveTabName={"Inactive Site"}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          activeData={activeSiteList}
          inactiveData={inactiveSiteList}
          activeFilters={activeSiteFilters}
          setActiveFilters={setActiveSiteFilters}
          inactiveFilters={inactiveSiteFilters}
          setInactiveFilters={setInactiveSiteFilters}
          searchFilters={activeSiteFilters}
          handleEntriesCountChange={handleEntriesCountChange}
        />
      </div>
    </div>
  );
};

export default Page;
