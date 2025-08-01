import { Row } from "@tanstack/react-table";

export type subGoals = {
  name: string;
  occurrence: string;
  period: string;
};

export type Goal = {
  id: string;
  _id: string;
  name: string;
  goal: string;
  occurrence: string;
  period: string;
  subGoals: subGoals[];
  year?: string;
  site?: { name: string; logoUrl: string; _id: string };
};

export type GoalTableProps = {
  data: Goal[];
  isDataLoading: boolean;
  columns: any;
};

export interface GetGoalsListParams {
  page: string;
  size: string;
  search: string;
  siteID: string;
  year: string;
  occurrence: string;
}

export interface CreateGoalPayload {
  goal: string;
  year: string;
  site: string;
}

export interface AddTaskPayload {
  maingoalId: string;
  period: string;
  occurrence: string;
  name: string;
}

export interface AddTaskModalProps {
  row: Row<Goal>;
  isAddTaskModalOpen: boolean;
  goalsListRefetch: () => void;
  setIsAddTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EditGoalModalProps {
  row: Row<Goal>;
  isEditGoalModalOpen: boolean;
  goalsListRefetch: () => void;
  setIsEditGoalModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EditGoalPayload {
  goal: string;
  year: string;
  site: string;
}

export interface EditTaskModalProps {
  goalsListRefetch: () => void;
}

export interface EditTaskPayload {
  maingoalId: string;
  period: string;
  occurrence: string;
  name: string;
}

export interface TaskData {
  _id: string;
  name: string;
  period: string;
  occurrence: string;
  maingoalId: string;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
  modifiedBy: string;
  deleted: boolean;
  inActive: boolean;
  main_goal: string;
}

export interface DeleteTaskModalProps {
  goalsListRefetch: () => void;
}

export interface DeleteGoalModalProps {
  row: Row<Goal>;
  isDeleteGoalModalOpen: boolean;
  goalsListRefetch: () => void;
  setIsDeleteGoalModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface HolidayTableCols {
  _id: string;
  id: string;
  createdBy: string;
  modifiedBy: string;
  createdAt: string;
  modifiedAt: string;
  deleted: boolean;
  inActive: boolean;
  name: string;
  year: string;
  date: string;
  default: boolean;
}

export interface SearchFilter {
  columnName: string;
  columnType: "STRING" | "DATE";
  columnValue: string;
  operation: "EQUAL_TO" | "MATCH_TO" | "IS_BETWEEN";
}

export interface FilterParams {
  page: number;
  size: number;
  searchFilters: SearchFilter[];
  sortRules: any[];
}

export interface AddHolidayPayload {
  name: string;
  year: string;
  date: string;
  default: boolean;
}

export interface AddHolidayModalProps {
  addHolidayModalOpen: boolean;
  refetchHolidayList: () => void;
  setAddHolidayModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EditHolidayPayload {
  name: string;
  year: string;
  date: string;
  default: boolean;
}

export interface EnquiryCols {
  id: string;
  enquiryDate: string;
  dob: string;
  showRoundDate: string;
  startDate: string;
  fullName: string;
  comment: string;
  workHours: string;
  weeklyIncome: string;
  reasonNotStarted: string;
  referralSource: string;
  town: string;
  fatherName: string;
  motherName: string;
  createdAt: string;
  modifiedAt: string;
  deleted: boolean;
  inActive: boolean;
  staffID: string | null;
  siteID: string | null;
  // Relations (nested)
  staffID_staff: {
    _id: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdBy: string;
    modifiedBy: string;
    createdAt: string;
    modifiedAt: string;
    deleted: boolean;
    inActive: boolean;
    appAccess: boolean;
    role: string;
    siteID: string;
  }[];

  siteID_sites: {
    _id: string;
    id: string;
    createdBy: string;
    modifiedBy: string;
    createdAt: string;
    modifiedAt: string;
    deleted: boolean;
    inActive: boolean;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    telephoneNumber: string;
    mobileNumber: string;
    location: string;
    siteEmail: string;
    logoUrl: string;
  }[];
}
