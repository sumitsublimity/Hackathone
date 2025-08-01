import { Dispatch, SetStateAction } from "react";

export type CostingItem = {
  category: string;
  ageGroup: string;
  costing: string;
};

export type CategoryItem = {
  id: string;
  name: string;
};

export type NormalizedCosting = {
  categoryName: string;
  ageGroupCostingMap: Record<string, string>;
};

export interface GenerateStaffTableParams {
  staffCount: number;
  ratio: number;
  hoursPerDay: number;
}

export interface CostingResponsePacket {
  _id: string;
  id: string;
  siteID: string;
  category: string;
  ageGroup: string;
  costing: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
  deleted: boolean;
  inActive: boolean;
}

export interface CostingApiResponse {
  errorCode: number;
  success: boolean;
  responsePacket: CostingResponsePacket[];
  violations: Record<string, unknown>;
}

export interface SiteDetailResponsePacket {
  ageGroup?: string[];
  createdAt: string;
  createdBy: string;
  deleted: boolean;
  email: string;
  firstName: string;
  id: string;
  inActive: boolean;
  lastName: string;
  location: string;
  logoUrl: string;
  mobileNumber: string;
  modifiedAt: string;
  modifiedBy: string;
  name: string;
  numberOfClassrooms: string;
  operatingHoursCapacity: string;
  siteEmail: string;
  telephoneNumber: string;
  _id: string;
}

export interface SiteDetailResponse {
  errorCode: number;
  success: boolean;
  responsePacket?: SiteDetailResponsePacket;
  violations?: Record<string, unknown>;
}

export interface SiteKeyValue {
  _id: string;
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  logoUrl: string;
  mobileNumber: string;
  telephoneNumber: string;
  siteEmail: string;
  numberOfClassrooms: string;
  operatingHoursCapacity: string;
  ageGroup: string[];
  inActive: boolean;
  deleted: boolean;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
}

export interface SiteKeyValueListResponse {
  errorCode: 0;
  success: true;
  responsePacket: SiteKeyValue[];
  violations: Record<string, never>;
}

export interface AgeGroupOption {
  label: string;
  value: string;
}

export interface Category {
  _id: string;
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
  deleted: boolean;
  inActive: boolean;
}

export interface CategoryListResponse {
  errorCode: 0;
  success: true;
  responsePacket: Category[];
  violations: Record<string, never>;
}

export interface CategoryOption {
  id: string;
  name: string;
}

export interface DropdownCategoryOptions {
  label: string;
  value: string;
}

export interface Staff {
  _id: string;
  id: string;
  siteID: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  appAccess: boolean;
  inActive: boolean;
  deleted: boolean;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
}

export interface StaffListResponse {
  errorCode: 0;
  success: true;
  responsePacket: Staff[];
  violations: Record<string, never>;
}

export type StaffRow = {
  staff: string;
  children: number;
  hoursPerDay: number;
  totalHours: number;
  weeklyHours: number;
};

export interface AddFeeModalProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  selectedSiteId: string;
  refetchData: () => void;
}
