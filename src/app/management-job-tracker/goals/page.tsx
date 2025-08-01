"use client";

// Framework imports:
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
// Libraries imports:
import { z } from "zod";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Row } from "@tanstack/react-table";
// Local imports:
import { AddTaskModal } from "./_components/AddTaskModal";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import { createGoal, getGoalsList } from "@/services/api/jobTracker";
import { createGoalSchema } from "@/lib/schemas/createGoalSchema";
import { DialogBox } from "@/components/DialogBox";
import { getSiteKeyValueList } from "@/services/api/staff/staff";
import { Goal } from "./_components/interfaces";
import { showToast } from "@/utils/alert";
import { TextAreaField } from "@/components/TextAreaField";
import { ToolTipWrapper } from "./_components/ToolTipWrapper";
import addGoalBanner from "@/../public/logo/add-goal-banner.svg";
import addTaskIcon from "@/../public/icons/add-task.svg";
import Button from "@/components/Button";
import CrossIcon from "@/../public/icons/cross.svg";
import deleteTaskIcon from "@/../public/icons/delete-row.svg";
import DropdownField from "@/components/DropdownField";
import editTaskIcon from "@/../public/icons/edit-row.svg";
import InputField from "@/components/InputField";
import Pagination from "@/components/Pagination";
import {
  DEFAULT_ENTRIES_COUNT,
  DEFAULT_PAGE_INDEX,
  ENTRIES_OPTIONS,
  GOAL_OCCURRENCE_OPTIONS,
} from "./_components/constants";
import { EditGoalModal } from "./_components/EditGoalModal";
import { EditTaskModal } from "./_components/EditTaskModal";
import { DeleteTaskModal } from "./_components/DeleteTaskModal";
import { DeleteGoalModal } from "./_components/DeleteGoalModal";
import GoalTable from "./_components/GoalTable";
import { getFiveYearOptions } from "@/utils/yearUtils";

type FormData = z.infer<typeof createGoalSchema>;

const Page = () => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false);
  const [isDeleteGoalModalOpen, setIsDeleteGoalModalOpen] = useState(false);
  const [rowData, setRowData] = useState<Row<Goal> | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [siteOptions, setSiteOptions] = useState([]);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  // Memoized to prevent calculation on every render:
  const { yearOptions, currentYear } = useMemo(() => getFiveYearOptions(), []);

  const [goalsListFilterParams, setGoalsListFilterParams] = useState({
    page: DEFAULT_PAGE_INDEX,
    size: DEFAULT_ENTRIES_COUNT,
    search: "",
    siteID: "",
    year: currentYear || "",
    occurrence: "",
  });

  /*++++++++++++++ React Hook Form + Zod For Form Validation: ++++++++++++++  */
  const {
    register,
    watch,
    trigger,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(createGoalSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  /*++++++++++++++ Tanstack Mutation For Creating Goals ++++++++++++++  */
  const createGoalMutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      showToast(MESSAGES.GOAL_CREATED_SUCCESS, ALERT_TYPES.SUCCESS);
      reset();
      setIsAddGoalModalOpen(false);
      goalsListRefetch();
    },
    onError: () => {
      showToast(MESSAGES.GOAL_CREATED_FAILURE, ALERT_TYPES.ERROR);
    },
  });

  const { isPending: isAddingGoalPending } = createGoalMutation;

  /*++++++++++++++ Tanstack Query To Fetch Goals List: ++++++++++++++  */
  const {
    data: goalsData,
    isLoading: isGoalsListLoading,
    refetch: goalsListRefetch,
  } = useQuery({
    queryKey: ["getGoalsList", goalsListFilterParams],
    queryFn: () => {
      return getGoalsList(goalsListFilterParams);
    },
    // This ensures this query runs after siteID is fetched.
    enabled: !!goalsListFilterParams.siteID,
    retry: false,
  });

  // Fallback for goalList when no response is returned by API:
  const goalsList = goalsData?.responsePacket?.[0] ?? {
    data: [],
    totalPages: 0,
  };
  // LOGIC: If the search query is not found then display 'No Record Found' in the table but if there is no goals to show when other filters are applied except search then display the banner:
  const isSearchMode = !!goalsListFilterParams.search;
  // LOGIC: This prevents display of banner during page change:
  const hasNoGoals = !isGoalsListLoading && goalsList?.data?.length === 0;
  // LOGIC: Banner is shown on initial render if no goals exists on a particular Site for a particular year:
  const canShowBanner = !isSearchMode && hasNoGoals;

  // Get data for site dropdown:
  async function fetchSiteDropdownList() {
    try {
      const response = await getSiteKeyValueList({
        searchFilters: [
          {
            columnName: "inActive",
            columnType: "BOOLEAN",
            columnValue: false,
            operation: "EQUAL_TO",
          },
        ],
        sortRules: [
          {
            columnName: "createdAt",
            operation: "DESC",
          },
        ],
      });

      const sites = response.responsePacket || [];
      const options = sites.map((site: any) => ({
        label: site.name,
        value: String(site.id),
      }));

      setSiteOptions(options);

      // Set siteID to goalsListFilterParams to get data:
      if (sites && options.length > 0) {
        setGoalsListFilterParams((prev) => {
          return { ...prev, siteID: options[0].value };
        });
      }
    } catch (error) {
      console.error("Failed to fetch site list:", error);
    }
  }

  function handleDialogOpenChange(isOpen: boolean) {
    setIsAddGoalModalOpen(isOpen);
    if (!isOpen) {
      reset();
    }
  }

  function onAddGoalFormSubmit(data: FormData) {
    const payload = {
      site: data.site,
      goal: data.addGoalText,
      year: data.addGoalYear,
    };

    createGoalMutation.mutate(payload);
  }

  /*++++++++++++++ TanStack Column Def with Display Logic ++++++++++++++  */
  const columns: ColumnDef<Goal>[] = [
    {
      header: "S.No",
      size: 50,
      cell: ({ row }) => {
        // Generate 1-based serial number for paginated rows:

        const sno =
          Number(goalsListFilterParams.page) *
            Number(goalsListFilterParams.size) +
          row.index +
          1;
        return <div className="text-center">{sno}</div>;
      },
    },
    {
      accessorKey: "goal",
      header: "Name of Goal",
      size: 430,
      cell: ({ row, getValue }) => (
        <div className="flex items-center">
          {row.getCanExpand() && (
            <button
              aria-label={`Expand row for ${row.original.name}`}
              className="cursor-pointer"
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="text-slateGreen" strokeWidth={2} />
              ) : (
                <ChevronRight className="text-slateGreen" strokeWidth={2} />
              )}
            </button>
          )}
          <span className="break-all">{getValue() as string}</span>
        </div>
      ),
    },
    {
      accessorKey: "occurrence",
      size: 100,
      header: "Occurrence",
      cell: (info) => info.getValue(),
    },
    {
      size: 100,
      accessorKey: "period",
      header: "Period",
      cell: (info) => info.getValue(),
    },
    {
      header: "Actions",
      size: 100,
      cell: ({ row }) => {
        return (
          <div className="flex flex-row gap-4 justify-start w-fit">
            <ToolTipWrapper toolTipText="Edit Goal">
              <button
                className="cursor-pointer hover:brightness-150"
                onClick={(e) => {
                  // This prevents expansion of row when click is intended for the button
                  e.stopPropagation();
                  setRowData(row);
                  setIsEditGoalModalOpen(true);
                }}
              >
                <Image src={editTaskIcon} alt="Edit task icon." />
              </button>
            </ToolTipWrapper>
            <ToolTipWrapper toolTipText="Delete Goal">
              <button
                className="cursor-pointer hover:brightness-70"
                onClick={(e) => {
                  // This prevents expansion of row when click is intended for the button
                  e.stopPropagation();
                  setRowData(row);
                  setIsDeleteGoalModalOpen(true);
                }}
              >
                <Image src={deleteTaskIcon} alt="Delete task icon." />
              </button>
            </ToolTipWrapper>
            <ToolTipWrapper toolTipText="Add Task">
              <button
                className="cursor-pointer hover:brightness-150"
                onClick={(e) => {
                  // This prevents expansion of row when click is intended for the button
                  e.stopPropagation();
                  setRowData(row);
                  setIsAddTaskModalOpen(true);
                }}
              >
                <Image src={addTaskIcon} alt="Add task icon." />
              </button>
            </ToolTipWrapper>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchSiteDropdownList();
  }, []);

  useEffect(() => {
    const debouncedSearch = setTimeout(() => {
      setGoalsListFilterParams((prev) => {
        return { ...prev, search: searchInput.trim() };
      });
    }, 500);
    return () => clearTimeout(debouncedSearch);
  }, [searchInput]);

  return (
    <main className="bg-offWhite min-h-[calc(100vh-72px)] p-6 overflow-auto">
      <article className="bg-white w-full rounded-2xl p-6 flex flex-col items-center">
        {/*++++++++++++++ Section: Page Filters ++++++++++++++  */}
        <section className="w-full flex flex-row gap-3 flex-wrap justify-between items-center">
          <h1 className="text-lg text-darkGreen font-semibold">Goals</h1>

          <div className="flex flex-row flex-wrap gap-3">
            {/*++++++++++++++ Search Bar ++++++++++++++  */}
            <div className="min-w-60">
              <InputField
                type="text"
                name="search"
                value={searchInput}
                icon="/icons/Search.svg"
                placeholder="Search..."
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
                iconRight={
                  searchInput && (
                    <button
                      className="cursor-pointer"
                      onClick={() => {
                        setSearchInput("");
                        setGoalsListFilterParams((prev) => {
                          return { ...prev, search: "" };
                        });
                      }}
                    >
                      <Image src={CrossIcon} alt="clear search query" />
                    </button>
                  )
                }
              />
            </div>

            {/*++++++++++++++ Yearly Calendar Dropdown ++++++++++++++  */}
            <div className="min-w-24">
              <DropdownField
                name="year"
                contentClassName="min-w-24"
                value={goalsListFilterParams.year}
                options={yearOptions}
                iconRight="/icons/calendar.svg"
                onChange={(name, value) => {
                  setGoalsListFilterParams((prev) => {
                    return { ...prev, year: value };
                  });
                }}
              />
            </div>

            {/*++++++++++++++ Goal Occurrence Dropdown ++++++++++++++  */}
            <div className="min-w-24">
              <DropdownField
                name="occurrence"
                contentClassName="min-w-24"
                value={goalsListFilterParams.occurrence}
                options={GOAL_OCCURRENCE_OPTIONS}
                onChange={(name, value) => {
                  setGoalsListFilterParams((prev) => {
                    return { ...prev, occurrence: value };
                  });
                }}
              />
            </div>

            {/*++++++++++++++ Site Selection Dropdown ++++++++++++++  */}
            <div className="min-w-32">
              <DropdownField
                name="site"
                className="max-w-32"
                contentClassName="max-w-32"
                value={goalsListFilterParams.siteID}
                placeholder="Select Site"
                options={siteOptions}
                onChange={(name, value) => {
                  setGoalsListFilterParams((prev) => {
                    return { ...prev, siteID: value };
                  });
                }}
              />
            </div>

            {/*++++++++++++++ Create Goal Button and Create Goal Modal ++++++++++++++  */}
            <DialogBox
              onSubmit={handleSubmit(onAddGoalFormSubmit)}
              open={isAddGoalModalOpen}
              onOpenChange={handleDialogOpenChange}
              title={"Add Goal"}
              modal={true}
              isSubmitting={isAddingGoalPending}
              triggerButton={
                <Button
                  text="Create Goals"
                  className="bg-slateGreen hover:bg-slateGreen hover:brightness-90 px-4 py-3 h-12"
                />
              }
              formFields={
                <div>
                  <div className="flex flex-row justify-center gap-5">
                    {/*++++++++++++++ Select Year Dropdown ++++++++++++++  */}
                    <div className="flex-1">
                      <DropdownField
                        autoFocus={true}
                        label="Year *"
                        contentClassName="w-44"
                        name="addGoalYear"
                        placeholder="Select Year"
                        value={watch("addGoalYear") || ""}
                        options={yearOptions}
                        error={errors.addGoalYear?.message}
                        onChange={(name, value) => {
                          setValue(name as keyof FormData, value);
                          trigger(name as keyof FormData);
                        }}
                      />
                    </div>

                    {/*++++++++++++++ Select Site Dropdown ++++++++++++++  */}
                    <div className="flex-1">
                      <DropdownField
                        label="Site *"
                        placeholder="Select Site"
                        className="max-w-44"
                        contentClassName="max-w-44"
                        name="site"
                        value={watch("site") || ""}
                        options={siteOptions}
                        error={errors.site?.message}
                        onChange={(name, value) => {
                          setValue(name as keyof FormData, value);
                          trigger(name as keyof FormData);
                        }}
                      />
                    </div>
                  </div>

                  {/*++++++++++++++ Add Goal TextArea ++++++++++++++  */}

                  <div className="mt-2">
                    <TextAreaField
                      {...register("addGoalText")}
                      error={errors.addGoalText?.message}
                      label="Add Goal *"
                      placeholder="Add Your Goal"
                    />
                  </div>
                </div>
              }
            />
          </div>
        </section>

        <hr className="border-lightTeal my-4 w-full" />

        {/*++++++++++++++ Section: Add Goals Banner ++++++++++++++  */}

        {canShowBanner ? (
          <section className="bg-offWhite min-h-1/2 w-1/2 rounded-2xl p-6 flex flex-col items-center gap-2">
            <div className="object-contain h-full w-full flex flex-col items-center justify-center">
              <Image
                src={addGoalBanner}
                alt="Add goals banner"
                priority={true}
              />
            </div>
            <h2 className="text-lg text-peach font-medium">
              There are no goals added
            </h2>
            <Button
              onClick={() => {
                setIsAddGoalModalOpen(true);
              }}
              text="Add Now"
              className="bg-slateGreen hover:bg-slateGreen hover:brightness-90 px-4 py-3 h-12"
            />
          </section>
        ) : (
          <section className="w-full">
            {/*++++++++++++++ Section: Goals Table + Pagination + Add Task Modal ++++++++++++++  */}
            <GoalTable
              data={goalsList?.data}
              columns={columns}
              isDataLoading={isGoalsListLoading}
            />

            {/*++++++++++++++ Pagination for Goals Table ++++++++++++++  */}
            <section className="flex flex-row justify-between items-center">
              {/* Display row dropdown only when data is available:  */}
              {goalsList?.totalPages !== 0 && (
                <div className="flex flex-row gap-2 items-center mt-6">
                  <span className="text-darkGreen">Rows</span>
                  <div className="min-w-20">
                    <DropdownField
                      className="min-w-20"
                      contentClassName="min-w-20"
                      name="size"
                      value={goalsListFilterParams.size}
                      options={ENTRIES_OPTIONS}
                      onChange={(name, value) => {
                        setGoalsListFilterParams((prev) => {
                          return {
                            ...prev,
                            page: DEFAULT_PAGE_INDEX,
                            size: value,
                          };
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              <Pagination
                pageIndex={Number(goalsListFilterParams.page)}
                totalPages={goalsList?.totalPages}
                onPageChange={(newPage) => {
                  setGoalsListFilterParams((prev) => ({
                    ...prev,
                    page: String(newPage),
                  }));
                }}
              />
            </section>

            {/*  ++++++++++++++ Section: Add Task Modal ++++++++++++++  */}
            {rowData && (
              <>
                {/*++++++++++++++ Add Task Modal Box ++++++++++++++  */}
                <AddTaskModal
                  goalsListRefetch={goalsListRefetch}
                  isAddTaskModalOpen={isAddTaskModalOpen}
                  setIsAddTaskModalOpen={setIsAddTaskModalOpen}
                  row={rowData}
                />

                {/*++++++++++++++ Edit Goal Modal Box ++++++++++++++  */}
                <EditGoalModal
                  row={rowData}
                  isEditGoalModalOpen={isEditGoalModalOpen}
                  setIsEditGoalModalOpen={setIsEditGoalModalOpen}
                  goalsListRefetch={goalsListRefetch}
                />

                {/*++++++++++++++ Delete Goal Modal Box ++++++++++++++  */}
                <DeleteGoalModal
                  row={rowData}
                  isDeleteGoalModalOpen={isDeleteGoalModalOpen}
                  setIsDeleteGoalModalOpen={setIsDeleteGoalModalOpen}
                  goalsListRefetch={goalsListRefetch}
                />
              </>
            )}

            {/*++++++++++++++ Edit Task Modal Box ++++++++++++++  */}
            <EditTaskModal goalsListRefetch={goalsListRefetch} />

            {/*++++++++++++++ Delete Task Modal Box ++++++++++++++  */}
            <DeleteTaskModal goalsListRefetch={goalsListRefetch} />
          </section>
        )}
      </article>
    </main>
  );
};
export default Page;
