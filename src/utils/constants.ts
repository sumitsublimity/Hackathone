export const API_BASE_URL = "http://nurseryadminnode.sublimitysoft.com/api/";
// export const API_BASE_URL = "http://192.168.0.24:4000/api/";

export const MESSAGES = {
  SPEND_ON_BUDGET_ADDED_SUCCESS: "Total spend saved successfully",
  SAVINGS_ADDED_SUCCESS: "Savings saved successfully",
  CASH_OUT_ADDED_SUCCESS: "Cash out saved successfully",
  CASH_IN_SALES_ADDED_SUCCESS: "Cash in sales saved successfully",
  PAYROLL_ADDED_SUCCESS: "Payroll saved successfully",
  PRIVATE_INCOME_ADDED_SUCCESS: "Private income saved successfully",
  ENQUIRY_DELETED_SUCCESS: "Enquiry deleted successfully",
  ENQUIRY_EDITED_SUCCESS: "Enquiry edited successfully",
  ENQUIRY_ADDED_SUCCESS: "Enquiry added successfully",
  ENQUIRY_ADDED_FAILURE: "Failed to add enquiry",
  HOLIDAY_EDITED_SUCCESS: "Holiday edited successfully",
  HOLIDAY_EDITED_FAILURE: "Failed to edit holiday",
  HOLIDAY_DELETED_SUCCESS: "Holiday deleted successfully",
  HOLIDAY_DELETED_FAILURE: "Failed to delete holiday",
  HOLIDAY_ADDED_SUCCESS: "Holiday added successfully",
  HOLIDAY_ADDED_FAILURE: "Failed to add holiday",
  GOAL_DELETED_SUCCESS: "Goal deleted successfully",
  GOAL_DELETED_FAILURE: "Failed to delete goal",
  TASK_DELETED_SUCCESS: "Task deleted successfully",
  TASK_DELETED_FAILURE: "Failed to delete task",
  TASK_EDITED_SUCCESS: "Task edited successfully",
  TASK_EDITED_FAILURE: "Failed to edit task",
  GOAL_EDITED_SUCCESS: "Goal edited successfully",
  GOAL_EDITED_FAILURE: "Failed to edit goal",
  TASK_CREATED_SUCCESS: "Task created successfully",
  TASK_CREATED_FAILURE: "Failed to create task",
  GOAL_CREATED_SUCCESS: "Goal created successfully",
  GOAL_CREATED_FAILURE: "Failed to create goal",
  CHANGE_PASSWORD_SUCCESS_MESSAGE: "Password changed successfully!",
  CREATE_SITE_SUCCESS_MESSAGE: "Site added successfully!",
  CREATE_STAFF_SUCCESS_MESSAGE: "Staff added successfully!",
  DATA_FETCH_ERROR_MESSAGE: "Error on fetching",
  DATA_FETCH_SUCCESS_MESSAGE: "Data fetched successfully!",
  ERROR_LOGIN: "Login failed, please try again",
  ERROR_MESSAGE: "Something went wrong, please try again later.",
  INCORRECT_PASSWORD: "Entered password do not match",
  LOGO_UPLOAD_ERROR: "Failed to upload logo. Please try again.",
  NETWORK_UNAVAILABLE_MESSAGE:
    "Network unavailable. Please check your connection.",
  NOT_FOUND_404: "Oops! We can't seem to find what you're looking for",
  OFFLINE_ERROR: "You are offline or the server is not responding.",
  OFFLINE: "User is offline",
  PACKAGE_ADDED_SUCCESS_MESSAGE: "Package added successfully!",
  PACKAGE_EDITED_SUCCESS_MESSAGE: "Package edited successfully!",
  PERMISSION_DENIED_MESSAGE: "Your session has expired",
  RESOURCE_NOT_FOUND_MESSAGE: "The requested resource was not found.",
  SITE_LIMIT_REACHED: "Site limit reached. Cannot create more sites.",
  SOMETHING_WENT_WRONG: "Something went wrong. Please try again later",
  STAFF_ROLE_FETCH_ERROR: "Error fetching staff role",
  SUCCESS_LOGIN: "You are successfully Logged In!",
  UNAUTHORIZED_REQUEST: "You are not authorized to access this resource.",
  UPDATE_SITE_SUCCESS_MESSAGE: "Site Updated successfully!",
  UPDATE_STAFF_SUCCESS_MESSAGE: "Staff Updated successfully!",
  WARNING_MESSAGE: "Error Fetching Data",
  UPDATE_GOAL_TASK: "Task is updated successfully",
  IMG_FILE_SIZE: "File size should not exceed 2 MB",
  IMPORTED_SUCCESSFULLY: "Imported successfully",
  EXPORTED_SUCCESSFULLY: "Exported successfully",
  FAILED_TO_IMPORT_FILE: "Failed to import file",
  FAILED_TO_EXPORT_FILE: "Failed to export data",
  ERROR_READING_FILE: "Error reading the file",
  IMPORTED_FILE_HAS_NO_DATA: "Imported file has no data",
  NO_DATA_AVAILABLE_TO_EXPORT: "No data available to export",
  BUDGET_CREATE: "Budget create successfully",
  BUDGET_UPDATE: "Budget Expense updated successfully",
  EXPENSE_UPDATE: "Expense saved successfully",
  SP_UPDATE: "S&P saved successfully",
  IMPORT_BUDGET: "Budget imported successfully",
  HOURS_SOLD_CREATE: "Hours sold saved successfully",
  HOURS_SOLD_DELETE: "Hours sold deleted successfully",
  ADD_CATEGORY_SUCCESS: "Category added successfully",
  EDIT_CATEGORY_SUCCESS: "Category edit successfully",
};

export const ALERT_TYPES = {
  ERROR: "error",
  SUCCESS: "success",
  WARNING: "warning",
};

export const DEFAULT_ENTRIES_COUNT = 10;
export const DEFAULT_PAGE_INDEX = 0;
export const DATE_FORMAT = "dd LLL yyyy";
export const CALENDAR_ICON = "/icons/calendar.svg";
export const EDIT_ICON = "/icons/edit-row.svg";
export const DELETE_ICON = "/icons/delete-row.svg";
export const ADD_ICON = "/icons/add-icon.svg";
export const EXPORT_ICON = "/icons/export.svg";
export const IMPORT_ICON = "/icons/import.svg";
export const RESET_ICON = "/icons/reset.svg";
export const SEARCH_ICON = "/icons/Search.svg";
export const ADD_EDIT_ICON = "/icons/AddEdit.svg";
export const FULLNAME_MAX_LENGTH = 50;
export const WEEKLY_INCOME_MAX_LENGTH = 5;
export const WEEKLY_HOURS_MAX_LENGTH = 3;
export const TEXTAREA_MAX_LENGTH = 200;
export const FEE_PER_HOUR_MAX_LENGTH = 4;
export const FEE_PER_HOUR_MIN_LENGTH = 1;
export const FORM_VALIDATION_MODE = "onBlur";
export const FORM_RE_VALIDATE_MODE = "onChange";

export const TOWN_OPTIONS = [
  { label: "Belton", value: "Belton" },
  { label: "Corby", value: "Corby" },
  { label: "Gretton", value: "Gretton" },
  { label: "Lyddington", value: "Lyddington" },
  { label: "Oakham", value: "Oakham" },
  { label: "Stamford", value: "Stamford" },
  { label: "Uppingham", value: "Uppingham" },
  { label: "Other", value: "Other" },
];

export const REFERRAL_SOURCE_OPTIONS = [
  {
    label: "Blossom",
    value: "Blossom",
  },
  {
    label: "Email",
    value: "Email",
  },
  {
    label: "Other Sibling Attends",
    value: "Other Sibling Attends",
  },
  {
    label: "Phone",
    value: "Phone",
  },
  {
    label: "Other",
    value: "Other",
  },
];

export const DENIAL_REASON_OPTIONS = [
  {
    label: "Cost Too High",
    value: "Cost Too High",
  },
  {
    label: "Chose Another Setting",
    value: "Chose Another Setting",
  },
  {
    label: "Moved Away",
    value: "Moved Away",
  },
  {
    label: "Not Right Setting",
    value: "Not Right Setting",
  },
  {
    label: "Other",
    value: "Other",
  },
];

export const IS_STARTING = [
  {
    label: "Yes",
    value: "Yes",
  },
  {
    label: "No",
    value: "No",
  },
];

export const MONTH_OPTIONS = [
  { label: "January", value: "January" },
  { label: "February", value: "February" },
  { label: "March", value: "March" },
  { label: "April", value: "April" },
  { label: "May", value: "May" },
  { label: "June", value: "June" },
  { label: "July", value: "July" },
  { label: "August", value: "August" },
  { label: "September", value: "September" },
  { label: "October", value: "October" },
  { label: "November", value: "November" },
  { label: "December", value: "December" },
];

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const SPHead = [
  {
    id: 1,
    name: "Hours sold",
    value: "totalHoursSold",
    editable: false,
  },
  {
    id: 2,
    name: "Occupancy",
    value: "occupancy",
    editable: false,
  },
  {
    id: 3,
    name: "Kitchen Meals Served",
    value: "kitchenMealsServed", // unique
    editable: true,
  },
  {
    id: 4,
    name: `Total Food Spend`,
    value: "totalFoodSpend",
    editable: false,
  },
  {
    id: 5,
    name: `Cost/Meal`,
    value: "costPerMeal",
    editable: false,
  },
  {
    id: 6,
    name: `Total Staff`,
    value: "totalStaff",
    editable: false,
  },
  {
    id: 7,
    name: "Total Staff Hours",
    value: "totalStaffHours", // unique
    editable: true,
  },
  {
    id: 8,
    name: "Leads/ Enquiries",
    value: "totalEnquiries",
    editable: false,
  },
  {
    id: 9,
    name: "Show Rounds",
    value: "showRounds",
    editable: false,
  },
  {
    id: 10,
    name: "New Starts",
    value: "newStart",
    editable: false,
  },
  {
    id: 11,
    name: "Accidents Reported",
    value: "accidentsReported", // unique
    editable: true,
  },
  {
    id: 12,
    name: "2yr Checks Completed",
    value: "completedTwoYearChecks", // unique
    editable: true,
  },
];
