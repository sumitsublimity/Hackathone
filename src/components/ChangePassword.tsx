"use client";
// Framework imports:
import React, { useEffect, useState } from "react";
import Form from "next/form";
import Image from "next/image";
// Libraries imports:
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/Button";
import InputField from "./InputField";
import { showToast } from "@/utils/alert";
import { useMutation } from "@tanstack/react-query";
// Local imports:
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import { updatePassword } from "@/services/api/auth";
import { checkNetwork } from "@/utils/network";
import { ErrorResponse, UpdatePasswordPayload } from "@/utils/interface";
import { AxiosError } from "axios";
import ValidationItem from "./ValidationItem";

export const ChangePassword = ({ onCancel }: { onCancel: () => void }) => {
  const changePasswordMutation = useMutation({
    mutationFn: (payload: UpdatePasswordPayload) => {
      return updatePassword(payload);
    },
  });

  const [passwordDetails, setPasswordDetails] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [visibleFields, setVisibleFields] = useState<{
    [key: string]: boolean;
  }>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [newPasswordValidations, setNewPasswordValidations] = useState({
    length: undefined as boolean | undefined,
    uppercase: undefined as boolean | undefined,
    lowercase: undefined as boolean | undefined,
    digit: undefined as boolean | undefined,
    specialChar: undefined as boolean | undefined,
  });

  const [showColor, setShowColor] = useState(false);

  const toggleVisibility = (field: string) => {
    setVisibleFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateInputs = (
    name: string,
    value: string,
    updatedDetails: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
  ) => {
    // Do nothing for new password field:
    if (name === "newPassword") {
      return true;
    }

    let error = "";

    // Validation error messages for current password field:
    if (name === "currentPassword" && value.length < 1) {
      error = "Please enter current password.";
    }
    // Validation error messages for confirm password field:
    if (name === "confirmPassword" && value !== updatedDetails.newPassword) {
      error = "Passwords do not match.";
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === "";
  };

  const validateNewPasswordRules = (newPassword: string) => {
    setShowColor(true);
    setNewPasswordValidations({
      length: newPassword.trim().length >= 8,
      uppercase: /[A-Z]/.test(newPassword.trim()),
      lowercase: /[a-z]/.test(newPassword.trim()),
      digit: /[0-9]/.test(newPassword.trim()),
      specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
        newPassword.trim(),
      ),
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\s+/g, "");

    const updatedDetails = {
      ...passwordDetails,
      [name]: sanitizedValue,
    };

    validateInputs(name, sanitizedValue, updatedDetails);

    if (name === "newPassword") {
      validateNewPasswordRules(sanitizedValue);
    }

    if (name === "confirmPassword" && updatedDetails.confirmPassword) {
      validateInputs(
        "confirmPassword",
        updatedDetails.confirmPassword,
        updatedDetails,
      );
    } else if (updatedDetails.newPassword) {
      validateInputs("newPassword", updatedDetails.newPassword, updatedDetails);
      validateNewPasswordRules(updatedDetails.newPassword);
    }

    setPasswordDetails(updatedDetails);
  };

  const handleSubmit = (e: React.FormEvent) => {
    checkNetwork();
    e.preventDefault();

    const isValid =
      validateInputs(
        "currentPassword",
        passwordDetails.currentPassword,
        passwordDetails,
      ) &&
      validateInputs(
        "newPassword",
        passwordDetails.newPassword,
        passwordDetails,
      ) &&
      validateInputs(
        "confirmPassword",
        passwordDetails.confirmPassword,
        passwordDetails,
      );

    if (isValid) {
      changePasswordMutation.mutate({
        newPassword: passwordDetails.newPassword,
        currentPassword: passwordDetails.currentPassword,
      });
    }
  };

  // If Update Password API Successes:
  useEffect(() => {
    if (changePasswordMutation.isSuccess) {
      showToast(MESSAGES.CHANGE_PASSWORD_SUCCESS_MESSAGE, ALERT_TYPES.SUCCESS);
      onCancel();
    }
  }, [changePasswordMutation.isSuccess]);

  // If Update Password API Fails:
  useEffect(() => {
    if (changePasswordMutation.isError) {
      const error = changePasswordMutation.error as AxiosError<ErrorResponse>;

      if (error.response?.data?.message) {
        showToast(error.response.data?.message, ALERT_TYPES.ERROR);
      }
    }
  }, [changePasswordMutation.isError]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl text-darkGreen">
          Change Password
        </DialogTitle>
        <DialogDescription className="text-sm text-slateGreen w-[80%]">
          In order to keep your account safe you need to create a strong
          password.
        </DialogDescription>
      </DialogHeader>

      <Form action="#" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1 pb-3">
          <div className="mb-1 relative">
            <InputField
              name="currentPassword"
              label="Current Password *"
              placeholder="Current Password"
              required
              type={visibleFields.currentPassword ? "text" : "password"}
              id="currentPassword"
              value={passwordDetails.currentPassword}
              onChange={handlePasswordChange}
              icon="/icons/lock.svg"
              isInvalid={!!formErrors.currentPassword}
              errorMessage={formErrors.currentPassword}
              iconRight={
                <button
                  type="button"
                  className="focus:outline-lightTeal"
                  onClick={() => toggleVisibility("currentPassword")}
                  title={
                    visibleFields.currentPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  aria-label={
                    visibleFields.currentPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <Image
                    src={
                      visibleFields.currentPassword
                        ? "/icons/eye-off.svg"
                        : "/icons/eye-on.svg"
                    }
                    alt={
                      visibleFields.currentPassword
                        ? "Hide password icon"
                        : "Show password icon"
                    }
                    width={20}
                    height={20}
                  />
                </button>
              }
            />
          </div>

          {/*++++++++++++++ New Password Field ++++++++++++++  */}
          <div className="mb-1 relative">
            <InputField
              name="newPassword"
              label="New Password *"
              placeholder="New Password"
              required
              type={visibleFields.newPassword ? "text" : "password"}
              id="newPassword"
              value={passwordDetails.newPassword}
              onChange={handlePasswordChange}
              icon="/icons/lock.svg"
              isInvalid={
                showColor &&
                Object.values(newPasswordValidations).some((v) => v === false)
              }
              iconRight={
                <button
                  type="button"
                  className="focus:outline-lightTeal"
                  onClick={() => toggleVisibility("newPassword")}
                  title={
                    visibleFields.newPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  aria-label={
                    visibleFields.newPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <Image
                    src={
                      visibleFields.newPassword
                        ? "/icons/eye-off.svg"
                        : "/icons/eye-on.svg"
                    }
                    alt={
                      visibleFields.newPassword
                        ? "Hide password icon"
                        : "Show password icon"
                    }
                    width={20}
                    height={20}
                  />
                </button>
              }
            />
          </div>

          {/*++++++++++++++ Confirm Password Field ++++++++++++++  */}
          <div className="mb-2 relative">
            <InputField
              name="confirmPassword"
              label="Confirm New Password *"
              placeholder="Confirm New Password"
              required
              type={visibleFields.confirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={passwordDetails.confirmPassword}
              onChange={handlePasswordChange}
              icon="/icons/lock.svg"
              isInvalid={!!formErrors.confirmPassword}
              errorMessage={formErrors.confirmPassword}
              iconRight={
                <button
                  type="button"
                  className="focus:outline-lightTeal"
                  onClick={() => toggleVisibility("confirmPassword")}
                  title={
                    visibleFields.confirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  aria-label={
                    visibleFields.confirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <Image
                    src={
                      visibleFields.confirmPassword
                        ? "/icons/eye-off.svg"
                        : "/icons/eye-on.svg"
                    }
                    alt={
                      visibleFields.confirmPassword
                        ? "Hide password icon"
                        : "Show password icon"
                    }
                    width={20}
                    height={20}
                  />
                </button>
              }
            />
          </div>
        </div>

        {/*++++++++++++++ New Password Validations ++++++++++++++  */}
        {newPasswordValidations && (
          <>
            <h3 className="font-bold text-darkGreen text-sm">
              New Password must contain:
            </h3>
            <div className={`mt-1 text-xs space-y-1`}>
              <ValidationItem
                showColor={showColor}
                isValid={newPasswordValidations.length}
                label="At least 8 characters"
              />
              <ValidationItem
                showColor={showColor}
                isValid={newPasswordValidations.uppercase}
                label="At least 1 uppercase letter"
              />
              <ValidationItem
                showColor={showColor}
                isValid={newPasswordValidations.lowercase}
                label="At least 1 lowercase letter"
              />
              <ValidationItem
                showColor={showColor}
                isValid={newPasswordValidations.digit}
                label="At least 1 digit"
              />
              <ValidationItem
                showColor={showColor}
                isValid={newPasswordValidations.specialChar}
                label="At least 1 special character"
              />
            </div>
          </>
        )}

        {/*++++++++++++++ Cancel and Submit Buttons ++++++++++++++  */}
        <DialogFooter>
          <Button
            type="reset"
            variant="default"
            text="Cancel"
            className="mt-4 px-4 py-2 h-10 bg-coffee text-white hover:bg-coffee hover:brightness-90"
            onClick={onCancel}
          />
          <Button
            type="submit"
            variant="default"
            text="Submit"
            className="mt-4 px-4 py-2 h-10 bg-darkGreen text-white hover:bg-darkGreen hover:brightness-120"
          />
        </DialogFooter>
      </Form>
    </>
  );
};
