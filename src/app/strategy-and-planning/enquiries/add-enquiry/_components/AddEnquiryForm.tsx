"use client";

// Framework imports:
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Libraries imports:
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
// Local imports:
import { TextAreaField } from "@/components/TextAreaField";
import { enquirySchema } from "@/lib/schemas/enquirySchema";
import Button from "@/components/Button";
import { DatePicker } from "@/components/DatePicker";
import DropdownField from "@/components/DropdownField";
import InputField from "@/components/InputField";
import RadioField from "@/components/ui/radio";
import { SmartDropdownWithOther } from "./SmartDropdownWithOther";
import {
  ALERT_TYPES,
  CALENDAR_ICON,
  DATE_FORMAT,
  DENIAL_REASON_OPTIONS,
  FULLNAME_MAX_LENGTH,
  IS_STARTING,
  MESSAGES,
  REFERRAL_SOURCE_OPTIONS,
  TEXTAREA_MAX_LENGTH,
  TOWN_OPTIONS,
  WEEKLY_HOURS_MAX_LENGTH,
  WEEKLY_INCOME_MAX_LENGTH,
} from "@/utils/constants";
import { fetchSiteDropdownOptions, SiteDropdownOption } from "@/services/api/site/fetchSiteDropdownOptions";
import { fetchStaffDropdownOptions } from "@/services/api/staff/fetchStaffDropdownOptions";
import {
  addEnquiry,
  getEnquiryDetailsById,
  updateEnquiry,
} from "@/services/api/strategyAndPlanning/enquiries";
import { showToast } from "@/utils/alert";
import { AddEnquiryPayload } from "@/utils/interface";
import { formatDateForAPI } from "@/utils/yearUtils";
import { allowOnlyAlphabets, allowOnlyNumbers } from "@/utils/inputSanitizers";

type FormData = z.infer<typeof enquirySchema>;

export default function AddEnquiryForm({ id }: { id: string }) {
  const isEditMode = id !== "0";
  const router = useRouter();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [siteOptions, setSiteOptions] = useState<SiteDropdownOption[]>([]);
  const [staffOptions, setStaffOptions] = useState([]);

  // ++++++++++++++ React Hook Form For Validation ++++++++++++++
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
    resolver: zodResolver(enquirySchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const selectedTown = watch("town");
  const selectedReason = watch("reasonNotStarted");
  const selectedReferralSource = watch("referralSource");
  const isStarting = watch("isStarting");
  const selectedSiteID = watch("siteID");

  /*++++++++++++++ Tanstack Mutation For Updating Enquiry ++++++++++++++  */
  const updateEnquiryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddEnquiryPayload }) =>
      updateEnquiry(id, payload),
    onSuccess: () => {
      showToast(MESSAGES.ENQUIRY_EDITED_SUCCESS, ALERT_TYPES.SUCCESS);
      router.push("/strategy-and-planning/enquiries");
    },
    onError: (error) => {
      console.error("Failed to update enquiry", error);
    },
  });

  const { isPending: isUpdateEnquiryPending } = updateEnquiryMutation;

  /*++++++++++++++ Tanstack Mutation For Adding Enquiry ++++++++++++++  */
  const addEnquiryMutation = useMutation({
    mutationFn: addEnquiry,
    onSuccess: () => {
      showToast(MESSAGES.ENQUIRY_ADDED_SUCCESS, ALERT_TYPES.SUCCESS);
      reset();
      router.push("/strategy-and-planning/enquiries");
    },
    onError: (error) => {
      console.error("Failed to add enquiry", error);
    },
  });
  const { isPending: isAddingEnquiryPending } = addEnquiryMutation;

  const handleDropdownChange = (name: string, value: string) => {
    setValue(name as keyof FormData, value);
    trigger(name as keyof FormData);
  };

  function handleEnquirySubmit(data: FormData) {
    const formattedEnquiryDate = formatDateForAPI(data.enquiryDate);
    const formattedDob = formatDateForAPI(data.dob);
    const formattedStartDate = formatDateForAPI(data.startDate);

    const payload: AddEnquiryPayload = {
      enquiryDate: formattedEnquiryDate,
      siteID: data.siteID,
      motherName: data.motherName ?? "",
      fullName: data.fullName,
      fatherName: data.fatherName ?? "",
      dob: formattedDob,
      referralSource:
        data.referralSource === "Other"
          ? (data.otherReferralSource ?? "")
          : (data.referralSource ?? ""),
      town: data.town === "Other" ? (data.otherTown ?? "") : (data.town ?? ""),
      reasonNotStarted:
        data.reasonNotStarted === "Other"
          ? (data.otherReason ?? "")
          : (data.reasonNotStarted ?? ""),
      comment: data.comment ?? "",
    };

    // Send this payload when user has gone a show round:
    if (data.showRoundDate) {
      const formattedShowRoundDate = formatDateForAPI(data.showRoundDate);
      payload.showRoundDate = formattedShowRoundDate
      payload.staffID = data.staffID ?? ""
    }

    // Send this payload when user is starting:
    if (data.isStarting === "Yes") {
      payload.startDate = formattedStartDate;
      payload.workHours = data.workHours ?? "";
      payload.weeklyIncome = data.weeklyIncome ?? "";
    }

    if (isEditMode) {
      updateEnquiryMutation.mutate({ id, payload });
    } else {
      addEnquiryMutation.mutate(payload);
    }
  }

  async function fetchAndPrefillData() {
    if (!id || id === "0") return;

    try {
      const enquiryResponse = await getEnquiryDetailsById(id);
      const enquiryData = enquiryResponse.responsePacket;

      // If the values are present in options then show them in dropdown:
      const isKnownTown = TOWN_OPTIONS.some(
        (opt) => opt.value === enquiryData.town,
      );
      const isKnownReferralSource = REFERRAL_SOURCE_OPTIONS.some(
        (opt) => opt.value === enquiryData.referralSource,
      );
      const isKnownReasonNotStarted = DENIAL_REASON_OPTIONS.some(
        (opt) => opt.value === enquiryData.reasonNotStarted,
      );

      /* "isStarting" is a frontend-only field. We infer it from `reasonNotStarted`:
      If reason is provided then child is NOT starting → "No"
      If reason is absent → child IS starting → "Yes" */
      const isStartingVal = enquiryData.reasonNotStarted === "" ? "Yes" : "No";

      reset({
        referralSource: isKnownReferralSource
          ? enquiryData.referralSource
          : "Other",
        otherReferralSource: isKnownReferralSource
          ? ""
          : enquiryData.referralSource,
        town: isKnownTown ? enquiryData.town : "Other",
        otherTown: isKnownTown ? "" : enquiryData.town,
        reasonNotStarted: isKnownReasonNotStarted
          ? enquiryData.reasonNotStarted
          : "Other",
        otherReason: isKnownReasonNotStarted
          ? ""
          : enquiryData.reasonNotStarted,

        isStarting: isStartingVal,
        enquiryDate: enquiryData.enquiryDate,
        siteID: enquiryData.siteID,
        fullName: enquiryData.fullName,
        fatherName: enquiryData.fatherName,
        motherName: enquiryData.motherName,
        dob: enquiryData.dob,
        showRoundDate: enquiryData.showRoundDate,
        staffID: enquiryData.staffID,
        startDate: enquiryData.startDate,
        workHours: enquiryData.workHours,
        weeklyIncome: enquiryData.weeklyIncome,
        comment: enquiryData.comment,
      });
    } catch (error) {
      console.error("Error fetching enquiry data", error);
    }
  }

  useEffect(() => {
    fetchAndPrefillData();
  }, [id, reset]);

  useEffect(() => {
    const loadSites = async () => {
      const options = await fetchSiteDropdownOptions();
      setSiteOptions(options);
    };
    loadSites();
  }, []);

  useEffect(() => {
    if (!selectedSiteID) return;

    const loadStaffForSite = async () => {
      try {
        const options = await fetchStaffDropdownOptions(selectedSiteID);
        setStaffOptions(options);
      } catch (error) {
        console.error("Error fetching staff options:", error);
      }
    };

    loadStaffForSite();
  }, [selectedSiteID]);


  useEffect(() => {
    if (isStarting === "Yes") {
      // Clear "reasonNotStarted" fields when child *is* starting
      setValue("reasonNotStarted", "");
      setValue("otherReason", "");
      trigger(["reasonNotStarted", "otherReason"]);
    } else if (isStarting === "No") {
      // Clear "startDate", "workHours" and "weeklyIncome" when child is *not* starting
      setValue("startDate", "");
      setValue("workHours", "");
      setValue("weeklyIncome", "");
      trigger(["startDate", "workHours", "weeklyIncome"]);
    }
  }, [isStarting, setValue, trigger]);


  return (
    <article>
      {/*++++++++++++++ Section: Form ++++++++++++++  */}
      <form
        className="flex flex-col gap-6 mt-3"
        onSubmit={handleSubmit(handleEnquirySubmit)}
      >
        <section className="flex flex-col gap-6">
          {/*++++++++++++++ Section: Site + Date of Enquiry + Child Name ++++++++++++++*/}
          <div className="flex flex-col md:flex-row gap-4 ">
            {/*++++++++++++++ Site Dropdown ++++++++++++++*/}
            <div className="flex-1">
              <DropdownField
                label="Site *"
                name="siteID"
                placeholder="Select Site"
                options={siteOptions}
                value={watch("siteID") || ""}
                onChange={handleDropdownChange}
                error={errors.siteID?.message}
              />
            </div>

            {/*++++++++++++++ Date of Enquiry ++++++++++++++*/}
            <div className="flex-1">
              <Controller
                name="enquiryDate"
                control={control}
                render={({ field }) => {
                  return (
                    <DatePicker
                      label="Date of Enquiry *"
                      placeholder="Date of Enquiry"
                      iconRight={CALENDAR_ICON}
                      dateFormat={DATE_FORMAT}
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => {
                        field.onChange(date?.toISOString());
                      }}
                      errorMessage={errors.enquiryDate?.message}
                    />
                  );
                }}
              />
            </div>

            {/*++++++++++++++ Child's Name ++++++++++++++*/}
            <div className="flex-1">
              <InputField
                {...register("fullName")}
                onInput={allowOnlyAlphabets}
                label="Child's Name *"
                placeholder="Full Name"
                maxLength={FULLNAME_MAX_LENGTH}
                errorMessage={errors.fullName?.message}
              />
            </div>
          </div>

          {/*++++++++++++++ Section: Father's Name + Mother's Name + Child's DOB ++++++++++++++*/}
          <div className="flex flex-col md:flex-row gap-4">
            {/*++++++++++++++ Father's Name ++++++++++++++*/}
            <div className="flex-1">
              <InputField
                {...register("fatherName")}
                onInput={allowOnlyAlphabets}
                label="Father's Name"
                placeholder="Father's Name"
                maxLength={FULLNAME_MAX_LENGTH}
                errorMessage={errors.fatherName?.message}
              />
            </div>

            {/*++++++++++++++ Mother's Name ++++++++++++++*/}
            <div className="flex-1">
              <InputField
                {...register("motherName")}
                onInput={allowOnlyAlphabets}
                label="Mother's Name"
                placeholder="Mother's Name"
                maxLength={FULLNAME_MAX_LENGTH}
                errorMessage={errors.motherName?.message}
              />
            </div>

            {/*++++++++++++++ Child's DOB ++++++++++++++*/}
            <div className="flex-1">
              <Controller
                name="dob"
                control={control}
                render={({ field }) => {
                  return (
                    <DatePicker
                      label="Child's Date of Birth *"
                      placeholder="Child's Date of Birth"
                      iconRight={CALENDAR_ICON}
                      endMonth={today}
                      disabled={[{ after: today }]}
                      dateFormat={DATE_FORMAT}
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => {
                        field.onChange(date?.toISOString());
                      }}
                      errorMessage={errors.dob?.message}
                    />
                  );
                }}
              />
            </div>
          </div>

          {/*++++++++++++++ Section: Date of Show Round + Shown By + Town ++++++++++++++*/}
          <div className="flex flex-col md:flex-row gap-4">
            {/*++++++++++++++ Date of Show Round ++++++++++++++*/}
            <div className="flex-1">
              <Controller
                name="showRoundDate"
                control={control}
                render={({ field }) => {
                  return (
                    <DatePicker
                      label="Date of Show Round"
                      placeholder="Date of Show Round"
                      dateFormat={DATE_FORMAT}
                      iconRight={CALENDAR_ICON}
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => {
                        return field.onChange(date?.toISOString());
                      }}
                      errorMessage={errors.showRoundDate?.message}
                    />
                  );
                }}
              />
            </div>

            {/*++++++++++++++ Shown By ++++++++++++++*/}
            <div className="flex-1">
              <DropdownField
                label="Shown By"
                placeholder="Name"
                name="staffID"
                options={staffOptions}
                value={watch("staffID") || ""}
                onChange={handleDropdownChange}
                error={errors.staffID?.message}
              />
            </div>

            {/*++++++++++++++ Town ++++++++++++++*/}
            <div className="flex-1">
              <SmartDropdownWithOther
                name="town"
                otherFieldName="otherTown"
                otherFieldPlaceholder="Enter Town"
                label="Town *"
                options={TOWN_OPTIONS}
                control={control}
                register={register}
                setValue={setValue}
                selectedValue={selectedTown}
                error={errors.town?.message}
                otherError={errors.otherTown?.message}
              />
            </div>
          </div>

          {/*++++++++++++++ Section: How Did You Hear + Is Starting + Reason For Not Starting ++++++++++++++*/}
          <div className="flex flex-col md:flex-row gap-4">
            {/*++++++++++++++ How Did You Hear ++++++++++++++*/}
            <div className="flex-1">
              <SmartDropdownWithOther
                name="referralSource"
                otherFieldName="otherReferralSource"
                otherFieldPlaceholder="Enter Referral Source"
                label="How did you hear about us? *"
                options={REFERRAL_SOURCE_OPTIONS}
                control={control}
                register={register}
                setValue={setValue}
                selectedValue={selectedReferralSource}
                error={errors.referralSource?.message}
                otherError={errors.otherReferralSource?.message}
              />
            </div>

            {/*++++++++++++++ Is Starting ++++++++++++++*/}
            <div className="flex-1">
              <RadioField
                label="Is Starting? *"
                name="isStarting"
                options={IS_STARTING}
                control={control}
                errorMessage={errors.isStarting?.message}
              />
            </div>

            {/*++++++++++++++ Reason For Not Starting ++++++++++++++*/}
            {isStarting === "No" ? (
              <div className="flex-1">
                <SmartDropdownWithOther
                  name="reasonNotStarted"
                  otherFieldName="otherReason"
                  otherFieldPlaceholder="Enter Reason"
                  label="Reason For Not Starting *"
                  options={DENIAL_REASON_OPTIONS}
                  control={control}
                  register={register}
                  setValue={setValue}
                  selectedValue={selectedReason}
                  error={errors.reasonNotStarted?.message}
                  otherError={errors.otherReason?.message}
                />
              </div>
            ) : (
              <div className="flex-1"></div>
            )}
          </div>

          {/*++++++++++++++ Section: Start Date + Weekly Hours + Weekly Income ++++++++++++++*/}
          {isStarting === "Yes" && (
            <div className="flex flex-col md:flex-row gap-4">
              {/*++++++++++++++ Start Date ++++++++++++++*/}
              <div className="flex-1">
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <DatePicker
                        label="Start Date *"
                        placeholder="Start Date"
                        iconRight={CALENDAR_ICON}
                        dateFormat={DATE_FORMAT}
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => {
                          return field.onChange(date?.toISOString());
                        }}
                        errorMessage={errors.startDate?.message}
                      />
                    );
                  }}
                />
              </div>

              {/*++++++++++++++ Weekly Hours ++++++++++++++*/}
              <div className="flex-1">
                <InputField
                  {...register("workHours")}
                  onInput={allowOnlyNumbers}
                  label="Weekly Hours"
                  placeholder="Hours"
                  maxLength={WEEKLY_HOURS_MAX_LENGTH}
                  errorMessage={errors.workHours?.message}
                />
              </div>

              {/*++++++++++++++ Weekly Income ++++++++++++++*/}
              <div className="flex-1">
                <InputField
                  {...register("weeklyIncome")}
                  onInput={allowOnlyNumbers}
                  label="Weekly Income"
                  placeholder="Income"
                  maxLength={WEEKLY_INCOME_MAX_LENGTH}
                  errorMessage={errors.weeklyIncome?.message}
                />
              </div>
            </div>
          )}

          {/*++++++++++++++ Section: Comments ++++++++++++++*/}
          <div>
            <TextAreaField
              label="Comments *"
              {...register("comment")}
              placeholder="Comments"
              maxLength={TEXTAREA_MAX_LENGTH}
              error={errors.comment?.message}
            />
          </div>
        </section>

        {/*++++++++++++++ Section: Buttons ++++++++++++++*/}
        <section className="flex flex-col flex-wrap gap-6 sm:justify-between sm:flex-row md:justify-end">
          <Button
            type="reset"
            text="Cancel"
            onClick={() => router.back()}
            className="w-full sm:w-1/3 md:w-auto h-10 sm:h-11 px-4 sm:px-6 bg-peach hover:bg-peach text-white text-sm sm:text-base hover:brightness-90"
          />

          <Button
            type="submit"
            text={isEditMode ? "Update Enquiry" : "Submit"}
            disabled={
              isEditMode ? isUpdateEnquiryPending : isAddingEnquiryPending
            }
            className="w-full sm:w-1/3 md:w-auto h-10 sm:h-11 px-4 sm:px-6 bg-darkGreen hover:bg-darkGreen text-white text-sm sm:text-base hover:brightness-120"
          />
        </section>
      </form>
    </article>
  );
}
