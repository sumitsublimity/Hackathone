import {
  AddHolidayPayload,
  AddTaskPayload,
  CreateGoalPayload,
  EditGoalPayload,
  EditHolidayPayload,
  EditTaskPayload,
  FilterParams,
  GetGoalsListParams,
} from "@/app/management-job-tracker/goals/_components/interfaces";
import { UrlConfig } from "@/services/ApiEndPoints";
import axiosInstance from "@/services/axiosInstance";
import { GoalTrackerQueryParams, taskStatusPayload } from "@/utils/interface";

export async function getGoalsList(params: GetGoalsListParams) {
  const queryParams = new URLSearchParams({
    page: params.page,
    size: params.size,
    search: params.search,
    siteID: params.siteID,
    year: params.year,
    occurrence: params.occurrence,
  });

  const url = `${UrlConfig.GET_GOALS_LIST}?${queryParams.toString()}`;

  const res = await axiosInstance.get(url);
  return res.data;
}

export async function getGoaltrackerData(params: GoalTrackerQueryParams) {
  const queryParams = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
    siteID: params.siteID,
    year: params.year
  });

  const url = `${UrlConfig.GET_TASK_TRACKER_DETAIL}?${queryParams.toString()}`;
  const res = await axiosInstance.get(url);
  return res.data?.responsePacket || [];
}

export async function createGoal(payload: CreateGoalPayload) {
  const res = await axiosInstance.post(UrlConfig.CREATE_GOAL, payload);
  return res.data;
}

export async function addTask(payload: AddTaskPayload) {
  const res = await axiosInstance.post(UrlConfig.ADD_TASK, payload);
  return res.data;
}

export async function editGoal(payload: EditGoalPayload, goalId: string) {
  const url = `${UrlConfig.EDIT_GOAL}${goalId}`;

  const res = await axiosInstance.put(url, payload);
  return res.data;
}

export async function editTask(payload: EditTaskPayload, taskId: string) {
  const url = `${UrlConfig.EDIT_TASK}${taskId}`;

  const res = await axiosInstance.put(url, payload);
  return res.data;
}

export async function deleteTask(payload: string[]) {
  const res = await axiosInstance.post(UrlConfig.DELETE_TASK, payload);
  return res.data;
}

export async function deleteGoal(payload: string[]) {
  const res = await axiosInstance.post(UrlConfig.DELETE_GOAL, payload);
  return res.data;
}
export async function taskStatusCompleted(payload: taskStatusPayload) {
  const res = await axiosInstance.post(
    UrlConfig.POST_SUBGOAL_STATUS_COMPLETE,
    payload,
  );
  return res.data;
}
export async function removeTaskStatus(statusIds: string[]) {
  const res = await axiosInstance.post(
    UrlConfig.POST_SUBGOAL_STATUS_DELETE,
    statusIds,
  );
  return res.data;
}

export async function getHolidayList(payload: FilterParams) {
  const res = await axiosInstance.post(UrlConfig.HOLIDAY_LIST, payload);
  return res.data;
}

export async function addHoliday(payload: AddHolidayPayload) {
  const res = await axiosInstance.post(UrlConfig.ADD_HOLIDAY, payload);
  return res.data;
}

export async function deleteHoliday(payload: string[]) {
  const res = await axiosInstance.post(UrlConfig.DELETE_HOLIDAY, payload);
  return res.data;
}

export async function editHoliday(payload: EditHolidayPayload, id: string) {
  const url = `${UrlConfig.EDIT_HOLIDAY}${id}`;
  const res = await axiosInstance.put(url, payload);
  return res.data;
}
