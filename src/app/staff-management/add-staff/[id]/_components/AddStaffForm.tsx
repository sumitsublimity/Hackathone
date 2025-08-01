"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/InputField";
import DropdownField from "@/components/DropdownField";
import Button from "@/components/Button";
import { ArrowDownWideNarrowIcon, Eye, EyeOff } from "lucide-react";
import { staffSchema } from "@/lib/schemas/staffSchema";
import { useRouter } from "next/navigation";
import RadioField from "@/components/ui/radio";
import {
  addStaff,
  EditStaffDetails,
  getSiteKeyValueList,
  getStaffDetailById,
  getStaffRoleList,
} from "@/services/api/staff/staff";
import { showToast } from "@/utils/alert";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import { createMutation } from "@/services/createMutation";
import { AddStaffFormProps, StaffCreatePayload } from "@/utils/interface";
import ValidationItem from "@/components/ValidationItem";
import { fetchSiteDropdownOptions } from "@/services/api/site/fetchSiteDropdownOptions";

type FormData = z.infer<typeof staffSchema>;

export const AddStaffForm = ({ ID }: AddStaffFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [siteOptions, setSiteOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isEdit = ID;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    trigger,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(staffSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    fetchAccessLevels();
    loadSiteOptions();
  }, []);

  useEffect(() => {
    if (isEdit && ID != "0") {
      setLoading(true);
      fetchStaffById(ID);
    }
  }, [ID, isEdit]);

  async function loadSiteOptions() {
    const options = await fetchSiteDropdownOptions();
    setSiteOptions(options);
  }

  const fetchAccessLevels = async () => {
    try {
      const response = await getStaffRoleList({
        searchFilter: [],
        sortRules: [],
      });
      const roles = response.responsePacket || [];
      const options = roles.map((role: any) => ({
        label: role.name,
        value: String(role.id),
      }));

      setRoleOptions(options);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      showToast(MESSAGES.STAFF_ROLE_FETCH_ERROR, ALERT_TYPES.ERROR);
    }
  };

  const { mutate: createStaff, isPending: isCreating } = createMutation(
    addStaff,
    (data: { message: string; success: boolean; errorCode: number }) => {
      if (data.errorCode === 0) {
        showToast(MESSAGES.CREATE_STAFF_SUCCESS_MESSAGE, ALERT_TYPES.SUCCESS);
        reset();
      } else {
        showToast(data.message, ALERT_TYPES.WARNING);
      }
    },
    (error) => {
      showToast(MESSAGES.SOMETHING_WENT_WRONG, ALERT_TYPES.ERROR);
    },
  );

  const { mutate: editstaff, isPending: isEditing } = createMutation(
    EditStaffDetails,
    (response) => {
      const { data, status } = response;
      if (status == 200) {
        showToast(MESSAGES.UPDATE_STAFF_SUCCESS_MESSAGE, ALERT_TYPES.SUCCESS);
      }
    },
    (error) => {
      showToast(MESSAGES.SOMETHING_WENT_WRONG, ALERT_TYPES.ERROR);
    },
  );

  function isCreatePasswordValid() {
    //It checks if all validations for create password are met:
    return (
      watch("password")?.length >= 8 &&
      /[A-Z]/.test(watch("password")) &&
      /[a-z]/.test(watch("password")) &&
      /[0-9]/.test(watch("password")) &&
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(watch("password"))
    );
  }

  const onSubmit = (data: FormData) => {
    if (!isCreatePasswordValid()) {
      showToast("Follow password guidelines", ALERT_TYPES.ERROR);
      return;
    }

    const appAccessBoolean = data.appAccess === "yes";

    const formattedData: StaffCreatePayload = {
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email,
      password: data.password,
      appAccess: appAccessBoolean,
      role: data.accessLevel,
      siteID: data.siteID,
    };

    if (isCreatePasswordValid()) {
      if (isEdit && ID != "0") {
        editstaff({ payload: formattedData, id: ID });
      } else {
        createStaff(formattedData);
      }
      router.push("/staff-management/staff-list");
    }
  };

  const fetchStaffById = async (ID: string) => {
    try {
      setLoading(true);
      const data = await getStaffDetailById(ID);
      const staff: StaffCreatePayload = data.responsePacket;

      if (staff) {
        showToast(MESSAGES.DATA_FETCH_SUCCESS_MESSAGE, "success");
        reset({
          firstname: staff.firstName || "",
          email: staff.email || "",
          password: staff.password || "",
          lastname: staff.lastName || "",
          appAccess: staff.appAccess ? "yes" : "no",
          accessLevel: staff.role,
          confirmPassword: staff.password,
          siteID: staff.siteID,
        });
      }
    } catch (err) {
      showToast(MESSAGES.DATA_FETCH_ERROR_MESSAGE, ALERT_TYPES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-6">
        {/* Grid Row 1: First Name, Last Name, Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField
            label="First Name *"
            placeholder="First Name"
            type="text"
            {...register("firstname")}
            errorMessage={errors.firstname?.message}
          />
          <InputField
            label="Last Name *"
            {...register("lastname")}
            placeholder="Last Name"
            type="text"
            errorMessage={errors.lastname?.message}
          />
          <InputField
            label="Email *"
            {...register("email")}
            placeholder="nursery@example.com"
            type="email"
            errorMessage={errors.email?.message}
            autoComplete="off"
          />
        </div>

        {/* Grid Row 2: Password, Confirm Password, Access Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField
            label="Password *"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            errorMessage={errors.password?.message}
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault(); // Prevent Space
            }}
            iconRight={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="focus:outline-lightTeal"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-slateGreen" />
                ) : (
                  <Eye className="w-5 h-5 text-slateGreen" />
                )}
              </button>
            }
          />
          <InputField
            label="Confirm Password *"
            placeholder="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            errorMessage={errors.confirmPassword?.message}
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault(); // Prevent Space
            }}
            iconRight={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="focus:outline-lightTeal"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-slateGreen" />
                ) : (
                  <Eye className="w-5 h-5 text-slateGreen" />
                )}
              </button>
            }
          />
          <RadioField
            label="Access to Dashboard/App *"
            name="appAccess"
            control={control}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
            errorMessage={errors.appAccess?.message}
          />
        </div>

        {/* Create Password Validation */}
        <div className="my-4">
          <h3 className="text-sm text-darkGreen font-medium">
            Your password must contain
          </h3>
          <div className="flex flex-row flex-wrap gap-x-5 text-xs my-2">
            <ValidationItem
              showColor={watch("password") ? true : false}
              isValid={watch("password")?.length >= 8}
              label="At least 8 characters"
            />
            <ValidationItem
              showColor={watch("password") ? true : false}
              isValid={/[A-Z]/.test(watch("password"))}
              label="At least 1 uppercase letter"
            />
            <ValidationItem
              showColor={watch("password") ? true : false}
              isValid={/[a-z]/.test(watch("password"))}
              label="At least 1 lowercase letter"
            />
            <ValidationItem
              showColor={watch("password") ? true : false}
              isValid={/[0-9]/.test(watch("password"))}
              label="At least 1 digit"
            />
            <ValidationItem
              showColor={watch("password") ? true : false}
              isValid={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                watch("password"),
              )}
              label="At least 1 special character"
            />
          </div>
        </div>
        {/* Grid Row 3: Access Level, Site */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DropdownField
            label="Access Level *"
            name="accessLevel"
            value={watch("accessLevel") || ""}
            onChange={(name, value) => {
              setValue(name as keyof FormData, value);
              trigger(name as keyof FormData);
            }}
            placeholder="Select Access Level"
            options={roleOptions}
            contentClassName="w-[24vw]"
            error={errors.accessLevel?.message}
          />
          <DropdownField
            label="Site *"
            name="siteID"
            value={watch("siteID") || ""}
            onChange={(name, value) => {
              setValue(name as keyof FormData, value);
              trigger(name as keyof FormData);
            }}
            placeholder="Select Site"
            options={siteOptions}
            contentClassName="w-[24vw]"
            error={errors.siteID?.message}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          <Button
            onClick={() => router.back()}
            type="reset"
            variant="default"
            text="Cancel"
            className="h-10 px-6 bg-peach text-white text-sm lg:text-base w-full sm:w-auto hover:bg-peach hover:brightness-90"
          />
          <Button
            type="submit"
            variant="default"
            text="Submit"
            className="h-10 px-6 bg-darkGreen text-white text-sm lg:text-base w-full sm:w-auto hover:bg-darkGreen hover:brightness-125"
          />
        </div>
      </form>
    </>
  );
};
