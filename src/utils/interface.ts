import { EnquiryCols } from "@/app/management-job-tracker/goals/_components/interfaces";
import { Row } from "@tanstack/react-table";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

export interface StaffCreatePayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  appAccess: boolean;
  role: string;
  siteID: string;
}

export interface StaffEditDetail {
  payload: StaffCreatePayload;
  id: string;
}

export interface StaffRoleFilter {
  searchFilter: FilterCondition[];
  sortRules: SortRules[];
}

export interface TabGroupProps {
  currentTab: string;
  setCurrentTab: Dispatch<SetStateAction<string>>;
  //   TODO: Needs to change any
  activeData: any;
  activeTabName: string;
  inactiveData: any;
  inactiveTabName: string;
  columns: any;
  activeFilters: SearchFilters;
  inactiveFilters: SearchFilters;
  setActiveFilters: Dispatch<SetStateAction<SearchFilters>>;
  setInactiveFilters: Dispatch<SetStateAction<SearchFilters>>;
  searchFilters: SearchFilters;
  handleEntriesCountChange: (value: string) => void;
}

export interface SearchFilters {
  page: number;
  size: number;
  inActive: boolean;
  search: string;
}

export interface FilterCondition {
  columnName: string;
  columnType: string;
  columnValue: string | boolean | number;
  operation: string;
}

export interface StaffTableCols {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone_no: string;
  appAccess: boolean;
  accessLevel: string;
  inActive: boolean;
}
export interface GetStaffQueryParams {
  page: number;
  size: number;
  inActive: boolean;
  search: string;
}

export interface SortRules {
  columnName: string;
  operation: string;
}

export interface PaginationProps {
  pageIndex: number;
  totalPages: number;
  pagesPerGroup?: number;
  onPageChange: (page: number) => void;
}

export interface TableActionBarType {
  pageTitle: string;
  searchTerm: string;
  buttonText: string;
  isButtonRequired: boolean;
  onButtonClick: () => void;
  clearSearchBar: () => void;
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  // searchFilters: SearchFilters;
  // handleEntriesCountChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface GetSiteQueryParams {
  page: number;
  size: number;
  inActive: boolean;
  search: string;
}

export interface SiteTableCols {
  firstName: string;
  lastName: string;
  email: string;
  name: string;
  siteAddress: string;
  siteEmail: string;
  mobileNumber: string;
  telephoneNumber: string;
  inActive: boolean;
  _id: string;
}

export interface SiteFormPayload {
  name: string;
  // siteAddress: string;
  siteEmail: string;
  firstName: string;
  lastName: string;
  telephoneNumber: string;
  mobileNumber: string;
  email: string;
  location: string;
  logoUrl?: string;
  numberOfClassrooms?: string;
  operatingHoursCapacity?: string;
  ageGroup?: any;
}

export interface UpdatePasswordPayload {
  newPassword: string;
  currentPassword: string;
}

export type ErrorResponse = {
  message: string;
};

export type UserData = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone_no: string;
  appAccess: boolean;
  accessLevel: string;
  inActive: boolean;
};

export interface TableActionButtonsProps {
  data: UserData | SiteTableCols;
  usedFor: string;
  activeDataRefetch: () => void;
  inactiveDataRefetch: () => void;
}

export interface toggleStaffPayload {
  inActive: boolean;
}

export interface toggleSitePayload {
  inActive: boolean;
}

export interface SiteEditDetail {
  payload: SiteFormPayload;
  id: string;
}

export type AddSiteFormProps = {
  ID?: string;
};

export type AddStaffFormProps = {
  ID?: string;
};

export type ValidationItemProps = {
  showColor: boolean;
  isValid: boolean | undefined;
  label: string;
};
export type SectionTitleProps = {
  title: string;
  className?: string;
};
export interface MonthYearPickerProps {
  selectedMonth: number;
  selectedYear: number;
  selectedSiteID: string;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onSiteChange: (siteID: string) => void;
}
export interface TaskTrackerHeaderProps {
  selectedMonth: number;
  selectedYear: number;
  siteLogo?: string;
  data: Subgoal[];
  localStatuses: Record<string, boolean>;
}
export interface TaskTrackerBodyProps {
  selectedMonth: number;
  selectedYear: number;
  data: Subgoal[];
  localStatuses: Record<string, boolean>;
  setLocalStatuses: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}
export interface GoalTrackerQueryParams {
  startDate: string;
  endDate: string;
  siteID: string;
  year: string;
}

export type OccuranceType = string;

export interface SubgoalStatus {
  status: string;
  date: string;
  _id: string;
}

export interface SiteGoalData {
  _id: string;
  siteName: string;
  siteLogo?: string;
  subGoals: Subgoal[];
}
export interface Subgoal {
  _id: string;
  name: string;
  period: OccuranceType;
  status: SubgoalStatus[];
}
export interface WeekData {
  days: (Date | null)[];
}
export interface WeekStyleParams {
  week: WeekData;
  index: number;
  hasExtraStart: boolean;
  hasExtraEnd: boolean;
  totalWeeks: number;
}
export interface WeekColorParams {
  index: number;
  hasExtraStart: boolean;
  hasExtraEnd: boolean;
  totalWeeks: number;
}
export interface TaskTrackerFooterProps {
  selectedMonth: number;
  selectedYear: number;
  data: Subgoal[];
  localStatuses: Record<string, boolean>;
}
export interface taskStatusPayload {
  subgoal_id: string;
  date: string;
  status: string;
}
export interface TableExportImportProps {
  exportData: () => any[];
  exportFilename?: string;
  onImport: (data: any[]) => void;
  showExport?: boolean;
  showImport?: boolean;
}

export interface SiteValuePayload {
  searchFilters: FilterCondition[];
  sortRules: SortRules[];
}

interface BudgetItem {
  head: string;
  year: number;
  budgetAmount: number;
}

interface BudgetEditPayload {
  month: string;
  siteID: string;
  data: BudgetItem[];
}

export interface BudgetEntry {
  head: string;
  year: number;
  budgetAmount: number;
}

export interface BudgetRecord {
  month: string;
  siteID: string;
  data: BudgetEntry[];
}

export interface AddEnquiryPayload {
  enquiryDate: string;
  siteID: string;
  motherName: string;
  fullName: string;
  fatherName: string;
  dob: string;
  referralSource: string;
  town: string;
  showRoundDate?: string;
  staffID?: string;
  reasonNotStarted: string;
  startDate?: string;
  workHours?: string;
  weeklyIncome?: string;
  comment: string;
}

export interface GetEnquiryPayload {
  page: number;

  size: number;

  searchFilters: FilterCondition[];

  sortRules: SortRules[];
}

export interface DeleteEnquiryProps {
  row: Row<EnquiryCols>;

  isDeleteEnquiryModalOpen: boolean;

  enquiryListRefetch: () => void;

  setIsDeleteEnquiryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface KPIDashboardPayload {
  year: number;
  month: string;
  siteID: string;

  privateIncome?: {
    privateIncome: number;
    threeYearFunding: number;
    twoYearFunding: number;
    senif: number;
    daf: number;
  };

  payroll?: {
    payroll: number;
    paye: number;
    pension: number;
  };

  cashInSales?: number;
  cashOut?: number;
  spendOnBudget?: number;
  savings?: number;
}

export interface GenericQueryPayload {
  searchFilters: FilterCondition[];
  sortRules: SortRules[];
}

export interface GetKPIDashboardParams {
  selectedSiteID: string;
  selectedYear: string;
}

export type SiteOption = {
  label: string; // site.name
  value: string; // String(site.id)
  ageGroup: string[]; // assuming ageGroup is an array of strings
  classRoom: string; // site.numberOfClassrooms
};

// Types based on your API response
export interface SPData {
  month: string;
  siteID: string;
  year: string;
  servedKitchenMeals: number;
  completedTwoYearChecks: number;
  accidentReported: number;
  totalStaffHours: number;
  totalHoursSold: number;
  occupancy: number;
  totalStaff: number;
  totalFoodSpend: number;
  costPerMeal: number;
  totalEnquiries: number;
  showRounds: number;
  newStart: number;
}

// Type for the array of SP data
export type SPDataArray = SPData[];

// Type for editable fields (only the ones that can be edited)
export type TSPRowEdit = {
  servedKitchenMeals: string;
  completedTwoYearChecks: string;
  accidentReported: string;
  totalStaffHours: string;
};

// Type for updating SP data (when sending to API)
export interface UpdateSPRequest {
  month: string;
  siteID: string;
  year: string;
  servedKitchenMeals: string;
  completedTwoYearChecks: string;
  accidentReported: string;
  totalStaffHours: string;
}

// Head type for table columns
export interface Head {
  id: number;
  name: string;
  value: keyof SPData; // This ensures value matches SPData keys
  editable: boolean;
}

// Props type for the component
export interface BudgetSPTableProps {
  onYearChange: string;
  changeSiteValue: string;
}

// API response type (if you need it)
export interface SPApiResponse {
  data: SPDataArray;
  success: boolean;
  message?: string;
}
