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
import { SearchFilters, StaffTableCols } from "@/utils/interface";
import { getStaffList } from "@/services/api/staff/staff";
import TableActionBar from "@/components/TableActionBar";
import SectionTitle from "@/components/SectionTitle";
import { fetchDataLoadingState } from "@/redux/slice/dataLoadingSlice";
import { DEFAULT_ENTRIES_COUNT, DEFAULT_PAGE_INDEX } from "@/utils/constants";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStaffFilters, setActiveStaffFilters] = useState<SearchFilters>({
    size: DEFAULT_ENTRIES_COUNT,
    page: DEFAULT_PAGE_INDEX,
    search: "",
    inActive: false,
  });
  const [inactiveStaffFilters, setInactiveStaffFilters] =
    useState<SearchFilters>({
      size: DEFAULT_ENTRIES_COUNT,
      page: DEFAULT_PAGE_INDEX,
      search: "",
      inActive: true,
    });

  /*++++++++++++++ Query Params For API ++++++++++++++  */
  // Memoized for performance optimization:
  const activeStaffFilterParams = useMemo(() => {
    return {
      size: activeStaffFilters.size,
      page: activeStaffFilters.page,
      search: activeStaffFilters.search,
      inActive: activeStaffFilters.inActive,
    };
  }, [activeStaffFilters]);

  // Memoized for performance optimization:
  const inactiveStaffFilterParams = useMemo(() => {
    return {
      page: inactiveStaffFilters.page,
      size: inactiveStaffFilters.size,
      search: inactiveStaffFilters.search,
      inActive: inactiveStaffFilters.inActive,
    };
  }, [inactiveStaffFilters]);

  /*++++++++++++++ Tanstack Query For Active Staff: ++++++++++++++  */
  const {
    data: activeStaffData,
    isLoading: isActiveStaffLoading,
    refetch: activeStaffRefetch,
  } = useQuery({
    queryKey: ["activeStaffList", activeStaffFilterParams],
    queryFn: () => {
      return getStaffList(activeStaffFilterParams);
    },
    retry: false,
  });

  /*++++++++++++++ Tanstack Query For Inactive Staff: ++++++++++++++  */
  const {
    data: inactiveStaffData,
    isLoading: isInactiveStaffLoading,
    refetch: inactiveStaffRefetch,
  } = useQuery({
    queryKey: ["inactiveStaffList", inactiveStaffFilterParams],
    queryFn: () => {
      return getStaffList(inactiveStaffFilterParams);
    },
    // Disable automatic fetching:
    enabled: false,
    retry: false,
  });

  // Staff List with fallback if data-structure changes:
  const activeStaffList = activeStaffData?.responsePacket?.[0] ?? [];
  const inactiveStaffList = inactiveStaffData?.responsePacket?.[0] ?? [];

  /*++++++++++++++ Column Headers for Tanstack Table: ++++++++++++++  */
  const columns: ColumnDef<StaffTableCols>[] = [
    {
      header: "S.NO",
      size: 50,
      cell: ({ row }) => {
        // Generate 1-based serial number for paginated rows:
        const currentPage =
          currentTab === "active"
            ? activeStaffFilters.page
            : inactiveStaffFilters.page;

        const pageSize =
          currentTab === "active"
            ? activeStaffFilters.size
            : inactiveStaffFilters.size;

        const sno = currentPage * pageSize + row.index + 1;
        return <div className="text-center">{sno}</div>;
      },
    },
    {
      accessorKey: "firstName",
      size: 150,
      header: "First Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "lastName",
      size: 150,
      header: "Last Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      size: 240,
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "appAccess",
      size: 130,
      header: "Access to Dashboard/App",
      cell: (info) => {
        const appAccess = info.getValue();
        return <div className="text-center">{appAccess ? "Yes" : "No"}</div>;
      },
    },
    {
      accessorKey: "accessLevel",
      size: 130,
      header: "Access Level",
      cell: (info) => {
        const accessLevel = info.getValue() as string;
        return <div className="text-center">{accessLevel}</div>;
      },
    },
    {
      header: "Actions",
      size: 120,
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <TableActionButtons
            data={rowData}
            usedFor={"staff"}
            activeDataRefetch={activeStaffRefetch}
            inactiveDataRefetch={inactiveStaffRefetch}
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
      setActiveStaffFilters((prev) => ({ ...prev, ...updates }));
    } else {
      setInactiveStaffFilters((prev) => ({ ...prev, ...updates }));
    }
  }

  function handleSearchTermChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  function handleAddStaffClick() {
    router.push("/staff-management/add-staff/0");
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
    // Fetch inactive staff list when user visit inactive tab or make changes in inactive filters:
    if (currentTab === "inactive") {
      inactiveStaffRefetch();
    }
  }, [inactiveStaffFilters, currentTab]);

  useEffect(() => {
    dispatch(
      fetchDataLoadingState(isActiveStaffLoading || isInactiveStaffLoading),
    );
  }, [isActiveStaffLoading, isInactiveStaffLoading]);

  return (
    <div className="w-full bg-offWhite overflow-auto">
      <div className="rounded-xl p-4 gap-6 m-6 bg-[var(--background)]">
        {/*++++++++++++++ Entries Dropdown, Search Field and Add Staff Button ++++++++++++++  */}
        <TableActionBar
          pageTitle="Staff List"
          searchTerm={searchTerm}
          onSearch={handleSearchTermChange}
          isButtonRequired={true}
          buttonText="Add Staff"
          onButtonClick={handleAddStaffClick}
          clearSearchBar={() => {
            setSearchTerm("");
          }}
        />
        {/*++++++++++++++ Active/Inactive Staff List With Pagination ++++++++++++++  */}
        <TabGroup
          columns={columns}
          activeTabName={"Active Staff"}
          inactiveTabName={"Inactive Staff"}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          activeData={activeStaffList}
          inactiveData={inactiveStaffList}
          activeFilters={activeStaffFilters}
          setActiveFilters={setActiveStaffFilters}
          inactiveFilters={inactiveStaffFilters}
          setInactiveFilters={setInactiveStaffFilters}
          searchFilters={activeStaffFilters}
          handleEntriesCountChange={handleEntriesCountChange}
        />
      </div>
    </div>
  );
};

export default Page;
