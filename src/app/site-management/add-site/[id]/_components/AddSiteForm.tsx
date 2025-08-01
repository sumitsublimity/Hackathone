"use client";

import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { siteSchema } from "@/lib/schemas/siteSchema";
import { AddSiteFormProps, SiteFormPayload } from "@/utils/interface";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import Image from "next/image";
import { Plus, X } from "lucide-react";

import {
  addSite,
  EditSiteDetails,
  getAllotedPackage,
  getSiteDetailById,
  getSiteList,
  uploadLogo,
} from "@/services/api/site/site";
import { showToast } from "@/utils/alert";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import { createMutation } from "@/services/createMutation";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader";
import { allowOnlyNumbers } from "@/utils/inputSanitizers";

type FormData = z.infer<typeof siteSchema>;

export const AddSiteForm = ({ ID }: AddSiteFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSiteLimitReached, setIsSiteLimitReached] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const isEdit = ID;

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      ageGroup: [{ value: "" }],
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ageGroup",
  });
  async function checkSiteLimit() {
    try {
      setIsLoading(true);
      const siteList = await getSiteList({
        size: 5,
        page: 0,
        search: "",
        inActive: true,
      });
      const allottedPackage = await getAllotedPackage();

      // Get the allotted and created site count:
      const createdSiteCount: number = siteList?.responsePacket[0]?.totalItems;
      const allottedSiteCount: number =
        allottedPackage?.responsePacket[0]?.packageId?.noOfSites;

      // Update the state:
      setIsSiteLimitReached(allottedSiteCount < createdSiteCount);
    } catch (error) {
      console.error("Error checking site limit", error);
      showToast(MESSAGES.SOMETHING_WENT_WRONG, ALERT_TYPES.ERROR);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUploadLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast(
        "Only JPG, PNG, SVG or WEBP formats are allowed.",
        ALERT_TYPES.ERROR,
      );
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast(MESSAGES.IMG_FILE_SIZE, ALERT_TYPES.ERROR);
      e.target.value = "";
      return;
    }

    try {
      const form = new FormData();
      form.append("file", file);

      const uploadResponse = await uploadLogo(form);

      setLogoUrl(uploadResponse?.fileUrl);
      showToast(uploadResponse.message, ALERT_TYPES.SUCCESS);
    } catch (error) {
      console.error("Failed to upload logo", error);
      showToast(MESSAGES.LOGO_UPLOAD_ERROR, ALERT_TYPES.ERROR);
    }
  }

  const { mutate: createSite, isPending: isCreating } = createMutation(
    addSite,
    (data: { message: string; success: boolean; errorCode: number }) => {
      if (data.errorCode === 0) {
        showToast(MESSAGES.CREATE_SITE_SUCCESS_MESSAGE, ALERT_TYPES.SUCCESS);
        reset();
      } else {
        showToast(data.message, ALERT_TYPES.WARNING);
      }
    },
    (error) => {
      console.error("Error adding the site:", error);
      showToast(MESSAGES.SOMETHING_WENT_WRONG, ALERT_TYPES.ERROR);
    },
  );

  const { mutate: editSite, isPending: isEditing } = createMutation(
    EditSiteDetails,
    (response) => {
      const { data, status } = response;
      if (status == 200) {
        showToast(MESSAGES.UPDATE_SITE_SUCCESS_MESSAGE, ALERT_TYPES.SUCCESS);
      }
    },
    (error) => {
      console.error("Error editing the Site:", error);
      showToast(MESSAGES.SOMETHING_WENT_WRONG, ALERT_TYPES.ERROR);
    },
  );

  const fetchSiteDetails = async (ID: string) => {
    try {
      setIsLoading(true);
      const data = await getSiteDetailById(ID);
      const site: SiteFormPayload = data.responsePacket;

      if (site) {
        showToast(MESSAGES.DATA_FETCH_SUCCESS_MESSAGE, ALERT_TYPES.SUCCESS);

        const ageGroup = site?.ageGroup?.map((item: any, index: any) => ({
          value: item,
        }));

        reset({
          name: site.name || "",
          // siteAddress: site.siteAddress || "",
          siteEmail: site.siteEmail || "",
          firstName: site.firstName || "",
          email: site.email || "",
          lastName: site.lastName || "",
          telephoneNumber: site.telephoneNumber,
          mobileNumber: site.mobileNumber,
          location: site.location,
          numberOfClassrooms: site.numberOfClassrooms || "",
          operatingHoursCapacity: site.operatingHoursCapacity || "",
          ageGroup: ageGroup || [{ value: "" }],
        });

        if (site.logoUrl) {
          setLogoUrl(site.logoUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching site details", error);
      // showToast(MESSAGES.DATA_FETCH_ERROR_MESSAGE, ALERT_TYPES.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: FormData) => {

    const temp = data.ageGroup.map((item) => ({ title: item.value }));
    console.log({ temp });
    const modified = { ...data, ageGroup: temp };
    if (ID === "0" && isSiteLimitReached) {
      showToast(MESSAGES.SITE_LIMIT_REACHED, ALERT_TYPES.ERROR);
      return;
    }

    const payload: any = {
      ...modified,
      ...(logoUrl ? { logoUrl } : {}),
    };

    if (isEdit && ID !== "0") {
      editSite({ payload, id: ID });
    } else {
      createSite(payload);
    }
    router.push("/site-management/site-list");
  };

  useEffect(() => {
    if (isEdit && ID != "0") {
      setIsLoading(true);
      fetchSiteDetails(ID);
    }
    // On Add Site Mode, check if more sites can be added
    if (ID === "0") {
      checkSiteLimit();
    }
  }, [ID, isEdit]);

  useEffect(() => {
    if (isSiteLimitReached) {
      showToast(MESSAGES.SITE_LIMIT_REACHED, ALERT_TYPES.ERROR);
    }
  }, [isSiteLimitReached]);

  if (isLoading) return <Loader />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="py-6 rounded-lg">
      {/* Site Info Section */}
      <div className="mt-4  p-6  bg-[var(--background)] rounded-2xl">
        <h3 className="text-darkGreen text-base sm:text-lg font-medium mb-3">
          Site Info
        </h3>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          <InputField
            label="Site Name *"
            {...register("name")}
            placeholder="Site Name"
            errorMessage={errors.name?.message}
          />

          <InputField
            label="Site Email *"
            {...register("siteEmail")}
            placeholder="yoursite@example.com"
            type="email"
            errorMessage={errors.siteEmail?.message}
          />

          <InputField
            label="No. of Classrooms*"
            {...register("numberOfClassrooms")}
            placeholder="No. of Classrooms"
            errorMessage={errors.numberOfClassrooms?.message}
            onInput={allowOnlyNumbers}
            maxLength={3}
          />
          <InputField
            label="Operating Capacity (Hrs)*"
            {...register("operatingHoursCapacity")}
            placeholder="Operating Capacity (Hrs)"
            errorMessage={errors.operatingHoursCapacity?.message}
            onInput={allowOnlyNumbers}
            maxLength={5}
          />
        </div>

        <div>
          <label className="mb-3 mt-3 block text-base font-medium text-darkGreen">
            Age Group*
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className={`relative w-[80%] ${index === fields.length - 1 ? "w-[85%]" : "w-full"}`}
              >
                <InputField
                  {...register(`ageGroup.${index}.value`)}
                  placeholder={`Group ${String.fromCharCode(65 + index)}`}
                  errorMessage={errors.ageGroup?.[index]?.value?.message}
                  iconRight={
                    fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )
                  }
                  maxLength={50}
                />

                {/* ➕ Add icon (only on last input) */}
                {index === fields.length - 1 && (
                  <button
                    type="button"
                    onClick={() => append({ value: "" })}
                    className="absolute -right-8 top-[24px] -translate-y-1/2 bg-peach w-6 h-6 flex items-center justify-center rounded-full hover:bg-peach"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Contact Section */}
      <div className="mt-4 bg-[var(--background)] py-6 px-4 sm:px-6 rounded-2xl">
        <h3 className="text-darkGreen text-base sm:text-lg font-medium mb-3">
          Primary Info
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField
            label="First Name *"
            {...register("firstName")}
            placeholder="First Name"
            errorMessage={errors.firstName?.message}
          />
          <InputField
            label="Last Name *"
            {...register("lastName")}
            placeholder="Last Name"
            errorMessage={errors.lastName?.message}
          />
          <InputField
            label="Telephone No *"
            {...register("telephoneNumber")}
            type="tel"
            maxLength={15}
            inputClassName="appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="Telephone No"
            errorMessage={errors.telephoneNumber?.message}
          />
          <InputField
            label="Mobile No *"
            {...register("mobileNumber")}
            type="tel"
            maxLength={15}
            inputClassName="appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="Mobile No"
            errorMessage={errors.mobileNumber?.message}
          />
          <InputField
            label="Email *"
            {...register("email")}
            placeholder="you@example.com"
            type="email"
            errorMessage={errors.email?.message}
          />
          <InputField
            label="Location *"
            {...register("location")}
            placeholder="Location"
            errorMessage={errors.location?.message}
          />
          {/* <MultipleSelector
            onSearchSync={(value) => {}}
            placeholder="trying to search 'a' to get more options..."
            groupBy="group"
            creatable
            emptyIndicator={
              <p className="w-full text-center text-lg leading-10 text-muted-foreground">
                no results found.
              </p>
            }
          /> */}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-6 mt-6">
        <div className="flex items-center gap-4 ">
          {/* ++++++++++++++ Logo Preview ++++++++++++++ */}
          <div className="w-[120px] h-[90px] sm:w-[160px] sm:h-[120px] border rounded-md border-[var(--border-gray)] overflow-hidden flex items-center justify-center p-2">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo Preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <Image
                src="/icons/logo-preview.svg"
                alt="Default Logo"
                width={160}
                height={120}
                className="w-full h-full object-contain"
              />
            )}
          </div>
          {/* ++++++++++++++ Logo Upload Button ++++++++++++++ */}
          <div>
            <input
              type="file"
              accept="image/*"
              id="uploadLogo"
              className="hidden"
              onChange={handleUploadLogo}
            />
            <label
              htmlFor="uploadLogo"
              className="cursor-pointer px-5 h-10 sm:h-12 text-sm sm:text-base rounded-md bg-coffee hover:brightness-90 text-white text-center leading-[2.5rem] flex items-center"
            >
              Add Site Logo
            </label>
          </div>
        </div>

        {/* ++++++++++++++ Cancel and Submit Buttons ++++++++++++++ */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 w-full lg:w-auto mt-4 lg:mt-0">
          <Button
            type="reset"
            text="Cancel"
            onClick={() => router.back()}
            className="w-full sm:w-auto h-10 sm:h-11 px-4 sm:px-6 bg-peach hover:bg-peach text-white text-sm sm:text-base hover:brightness-90"
          />
          <Button
            type="submit"
            text="Submit"
            disabled={isSiteLimitReached}
            className="w-full sm:w-auto h-10 sm:h-11 px-4 sm:px-6 bg-darkGreen hover:bg-darkGreen text-white text-sm sm:text-base hover:brightness-120"
          />
        </div>
      </div>
    </form>
  );
};

export default AddSiteForm;
