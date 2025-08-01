"use client";

// Framework imports:
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Libraries imports:
import type { Row } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
// Local imports:
import DropdownField from "@/components/DropdownField";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { getDateRange, getFiveYearOptions } from "@/utils/yearUtils";
import TableComp from "@/components/Table";
import { ENTRIES_OPTIONS } from "@/app/management-job-tracker/goals/_components/constants";
import { updateSearchFilters } from "@/utils/updateFilters";
import Pagination from "@/components/Pagination";
import { EnquiryCols } from "@/app/management-job-tracker/goals/_components/interfaces";
import { ToolTipWrapper } from "@/app/management-job-tracker/goals/_components/ToolTipWrapper";
import { getEnquiryList } from "@/services/api/strategyAndPlanning/enquiries";
import { fetchDataLoadingState } from "@/redux/slice/dataLoadingSlice";
import { fetchSiteDropdownOptions, SiteDropdownOption } from "@/services/api/site/fetchSiteDropdownOptions";
import {
  ADD_ICON,
  DATE_FORMAT,
  DEFAULT_ENTRIES_COUNT,
  DEFAULT_PAGE_INDEX,
  DELETE_ICON,
  EDIT_ICON,
  EXPORT_ICON,
  IMPORT_ICON,
  RESET_ICON,
} from "@/utils/constants";
import { DeleteEnquiryModal } from "./_components/DeleteEnquiryModal";
import NoDataBanner from "@/components/NoDataBanner";
import AddIcon from "@/utils/AddIcon";

function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentYear, yearOptions } = getFiveYearOptions();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [rowData, setRowData] = useState<Row<EnquiryCols> | null>(null);
  const [initialSelectedSite, setInitialSelectedSite] = useState("");
  const [isDeleteEnquiryModalOpen, setIsDeleteEnquiryModalOpen] =
    useState(false);

  const currentYearRange = getDateRange(
    new Date(Number(currentYear), 0, 1),
    new Date(Number(currentYear), 11, 31),
  );

  const [siteOptions, setSiteOptions] = useState<SiteDropdownOption[]>([]);
  const [selectedSiteID, setSelectedSiteID] = useState<string>("");
  const [enquiryFilterParams, setEnquiryFilterParams] = useState({
    page: DEFAULT_PAGE_INDEX,
    size: DEFAULT_ENTRIES_COUNT,
    searchFilters: [
      {
        columnName: "enquiryDate",
        columnValue: currentYearRange,
        columnType: "STRING",
        operation: "IS_BETWEEN",
      },
    ],
    sortRules: [{ columnName: "createdAt", operation: "DESC" }],
  });

  /*++++++++++++++ Tanstack Query To Fetch Goals List: ++++++++++++++  */
  const {
    data: enquiryData,
    isLoading: isEnquiryLoading,
    refetch: enquiryListRefetch,
  } = useQuery({
    queryKey: ["enquiryList", enquiryFilterParams],
    queryFn: () => {
      return getEnquiryList(enquiryFilterParams);
    },
    retry: false,
  });

  const enquiryList = enquiryData?.data ?? [];
  const totalPages = enquiryData?.totalPages ?? 1;
  const canShowBanner = !isEnquiryLoading && enquiryList.length === 0;

  /*++++++++++++++ Column Headers for Tanstack Table: ++++++++++++++  */
  const enquiryColumns: ColumnDef<EnquiryCols>[] = [
    {
      // Generate 1-based serial number for paginated rows:
      header: "SNO",
      size: 50,
      cell: ({ row }) => {
        const currentPage = enquiryFilterParams.page;
        const pageSize = enquiryFilterParams.size;
        const sno = currentPage * pageSize + row.index + 1;
        return <div className="text-center">{sno}</div>;
      },
    },
    {
      accessorKey: "enquiryDate",
      header: "Date of Enquiry",
      cell: (info) => {
        const rawDate = info.getValue() as string;
        if (!rawDate || isNaN(new Date(rawDate).getTime())) return "-";
        return format(new Date(rawDate), DATE_FORMAT);
      },
    },
    {
      accessorKey: "fullName",
      header: "Child's Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "fatherName",
      header: "Father's Name",
      cell: ({ row }) => {
        const fatherName = row.original.fatherName;
        return (
          <div className={fatherName ? "text-left" : "text-center"}>
            {fatherName || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "motherName",
      header: "Mother's Name",
      cell: ({ row }) => {
        const motherName = row.original.motherName;
        return (
          <div className={motherName ? "text-left" : "text-center"}>
            {motherName || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "dob",
      header: "Date of Birth",
      cell: (info) => {
        const rawDate = info.getValue() as string;
        if (!rawDate || isNaN(new Date(rawDate).getTime())) return "-";
        return format(new Date(rawDate), DATE_FORMAT);
      },
    },
    {
      accessorKey: "referralSource",
      header: "How did you hear about us?",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "town",
      header: "Town",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "showRoundDate",
      header: "Date of Show Round",
      cell: (info) => {
        const rawDate = info.getValue() as string;
        let value;
        if (!rawDate || isNaN(new Date(rawDate).getTime())) {
          value = "-"
        } else {
          value = format(new Date(rawDate), DATE_FORMAT);
        };
        return <div className={`${rawDate ? "text-left" : "text-center"}`}>{value}</div>
      },
    },
    {
      header: "Shown By",
      cell: ({ row }) => {
        const firstName = row.original?.staffID_staff[0]?.firstName || "";
        const lastName = row.original?.staffID_staff[0]?.lastName || "";
        let value;
        const isEmpty = firstName === "" && lastName === ""
        if (isEmpty) {
          value = "-"
        } else {
          value = `${firstName} ${lastName}`
        }
        return <div className={`${isEmpty ? "text-center" : "text-left"}`}>{value}</div>
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: (info) => {
        const rawDate = info.getValue() as string;
        let value;
        if (!rawDate || isNaN(new Date(rawDate).getTime())) {
          value = "-"
        } else {
          value = format(new Date(rawDate), DATE_FORMAT);
        }
        return <div className={`${rawDate ? "text-left" : "text-center"}`}>{value}</div>
      },
    },
    {
      accessorKey: "reasonNotStarted",
      header: "Reason For Not Starting",
      cell: ({ row }) => {
        const reasonNotStarted = row.original.reasonNotStarted;
        return (
          <div className={reasonNotStarted ? "text-left" : "text-center"}>
            {reasonNotStarted || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "comment",
      header: "Comments",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "workHours",
      header: "WK Hours",
      cell: ({ row }) => {
        const workHours = row.original.workHours;
        return (
          <div className={workHours ? "text-left" : "text-center"}>
            {workHours || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "weeklyIncome",
      header: "WK Income",
      cell: ({ row }) => {
        const weeklyIncome = row.original.weeklyIncome;
        return (
          <div className={weeklyIncome ? "text-left" : "text-center"}>
            {weeklyIncome || "-"}
          </div>
        );
      },
    },
    {
      header: "Actions",
      size: 100,
      cell: ({ row }) => {
        const enquiryId = row.original.id;
        return (
          <div className="flex flex-row justify-evenly py-3">
            <ToolTipWrapper toolTipText="Edit Enquiry ">
              <button
                className="cursor-pointer hover:brightness-150"
                aria-label="Edit enquiry"
                onClick={() => {
                  router.push(
                    `/strategy-and-planning/enquiries/add-enquiry/${enquiryId}`,
                  );
                }}
              >
                <Image
                  src={EDIT_ICON}
                  alt="Edit icon."
                  height={17}
                  width={17}
                />
              </button>
            </ToolTipWrapper>
            <ToolTipWrapper toolTipText="Delete Enquiry">
              <button
                onClick={() => {
                  setRowData(row);
                  setIsDeleteEnquiryModalOpen(true);
                }}
                className="cursor-pointer hover:brightness-70"
                aria-label="Delete enquiry"
              >
                <Image
                  src={DELETE_ICON}
                  alt="Delete icon."
                  height={17}
                  width={17}
                />
              </button>
            </ToolTipWrapper>
          </div>
        );
      },
    },
  ];

  function handleYearChange(value: string) {
    setSelectedYear(value);
    setEnquiryFilterParams((prev) => {
      const dateRange = getDateRange(
        new Date(Number(value), 0, 1),
        new Date(Number(value), 11, 31),
      );
      return {
        ...prev,
        page: DEFAULT_PAGE_INDEX,
        searchFilters: updateSearchFilters({
          prevFilters: prev.searchFilters,
          name: "enquiryDate",
          value: dateRange,
          columnType: "STRING",
          operation: "IS_BETWEEN",
        }),
      };
    });
  }

  function handleSiteChange(value: string) {
    setSelectedSiteID(value);
    setEnquiryFilterParams((prev) => ({
      ...prev,
      page: DEFAULT_PAGE_INDEX,
      searchFilters: updateSearchFilters({
        prevFilters: prev.searchFilters,
        name: "siteID",
        value: value,
        columnType: "STRING",
        operation: "EQUAL_TO",
      }),
    }));
  }

  useEffect(() => {
    dispatch(fetchDataLoadingState(isEnquiryLoading));
  }, [isEnquiryLoading]);

  useEffect(() => {
    const loadSites = async () => {
      const options = await fetchSiteDropdownOptions();
      setSiteOptions(options);

      // Optionally set first site ID but do not fetch API yet
      if (options.length > 0) {
        const firstSiteId = options[0].value;
        setInitialSelectedSite(firstSiteId);
        handleSiteChange(firstSiteId);
      }
    };
    loadSites();
  }, []);

  return (
    <main className="bg-offWhite min-h-[calc(100vh-72px)] p-6 overflow-auto">
      <article className="bg-white w-full min-h-[calc(100vh-120px)] rounded-2xl p-6 flex flex-col">
        <PageHeader title="Enquiries">
          {/*++++++++++++++ Section: Page Filters ++++++++++++++  */}
          <div className="flex flex-row gap-2 flex-wrap lg:flex-nowrap">
            <div className="w-full sm:flex-1 lg:min-w-40">
              <DropdownField
                name="siteID"
                className="lg:min-w-40"
                options={siteOptions}
                value={selectedSiteID}
                onChange={(name, value) => {
                  handleSiteChange(value);
                }}
              />
            </div>
            <div className="w-full sm:flex-1 lg:min-w-26">
              <DropdownField
                name="year"
                contentClassName="min-w-20"
                options={yearOptions}
                value={selectedYear}
                onChange={(name, value) => {
                  handleYearChange(value);
                }}
              />
            </div>
            <div className="flex flex-row flex-wrap gap-2 w-full sm:flex-nowrap">
              <Button
                onClick={() => {
                  handleSiteChange(initialSelectedSite);
                  handleYearChange(currentYear);
                }}
                className="h-11 w-full sm:flex-1 px-4 bg-skyBlue hover:bg-skyBlue hover:brightness-90 cursor-pointer"
              >
                <div className="flex flex-row gap-2">
                  <Image
                    src={RESET_ICON}
                    alt="Add icon"
                    height={15}
                    width={15}
                  />
                  Reset
                </div>
              </Button>
              <Button
                onClick={() => {
                  router.push("/strategy-and-planning/enquiries/add-enquiry/0");
                }}
                className="h-11 w-full sm:flex-1 px-4 bg-peach hover:bg-peach hover:brightness-90 cursor-pointer"
              >
                <div className="flex flex-row gap-2">
                  <Image src={ADD_ICON} alt="Add icon" height={15} width={15} />
                  Add
                </div>
              </Button>
            </div>
            <div className="flex flex-row flex-wrap gap-2 w-full sm:flex-nowrap">
              <Button className="h-11 w-full sm:flex-1 px-4 bg-darkGreen hover:bg-darkGreen hover:brightness-120 cursor-pointer">
                <div className="flex flex-row gap-2">
                  <Image
                    src={IMPORT_ICON}
                    alt="Import icon"
                    height={15}
                    width={15}
                  />
                  Import
                </div>
              </Button>
              <Button className="h-11 w-full sm:flex-1 px-4 bg-coffee hover:bg-coffee hover:brightness-90 cursor-pointer">
                <div className="flex flex-row gap-2">
                  <Image
                    src={EXPORT_ICON}
                    alt="Export icon"
                    height={15}
                    width={15}
                  />
                  Export
                </div>
              </Button>
            </div>
          </div>
        </PageHeader>

        {canShowBanner ? (
          /*++++++++++++++ Section: No Data Banner ++++++++++++++  */
          <NoDataBanner
            bannerText="There are no enquiries at this time. "

          >
            <Button onClick={() => {
              router.push("/strategy-and-planning/enquiries/add-enquiry/0");
            }} className="h-11 inline-flex items-center gap-2 text-sm bg-peach hover:bg-peach hover:brightness-90 cursor-pointer">
              <AddIcon />
              Add Enquiry
            </Button>
          </NoDataBanner>
        ) : (
          /*++++++++++++++ Section: Enquiry Table ++++++++++++++  */
          <section>
            <TableComp data={enquiryList || []} columns={enquiryColumns} />
          </section>
        )}

        {/*++++++++++++++ Section: Pagination + Row Dropdown ++++++++++++++  */}
        {totalPages !== 0 && (
          <section>
            <div className="flex flex-row gap-2 justify-between items-center mt-6">
              {/* ++++++++++++++ Entries Selector Dropdown: ++++++++++++++ */}
              <div className="flex flex-row gap-2 items-center">
                <span className="text-darkGreen">Rows</span>
                <div className="min-w-20">
                  <DropdownField
                    className="min-w-20"
                    contentClassName="min-w-20"
                    name="size"
                    value={String(enquiryFilterParams.size)}
                    options={ENTRIES_OPTIONS}
                    onChange={(name, value) => {
                      setEnquiryFilterParams((prev) => {
                        return {
                          ...prev,
                          size: Number(value),
                          page: DEFAULT_PAGE_INDEX,
                        };
                      });
                    }}
                  />
                </div>
              </div>

              {/* ++++++++++++++ Pagination: ++++++++++++++ */}
              <Pagination
                pageIndex={enquiryFilterParams.page}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  setEnquiryFilterParams((prev) => {
                    return { ...prev, page: newPage };
                  });
                }}
              />
            </div>
          </section>
        )}
      </article>

      {/*++++++++++++++ Section: Delete Enquiry Modal ++++++++++++++  */}
      {rowData && (
        <DeleteEnquiryModal
          row={rowData}
          isDeleteEnquiryModalOpen={isDeleteEnquiryModalOpen}
          setIsDeleteEnquiryModalOpen={setIsDeleteEnquiryModalOpen}
          enquiryListRefetch={enquiryListRefetch}
        />
      )}
    </main>
  );
}
export default Page;
