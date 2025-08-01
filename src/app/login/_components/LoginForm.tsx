"use client";

import InputField from "@/components/InputField";
import { Loader } from "@/components/Loader";
import { loginSchema } from "@/lib/schemas/loginSchema";
import { showToast } from "@/utils/alert";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLogin } from "../../../services/query/auth.query";
import { useRouter } from "next/navigation";

// Infer the form data type from your Zod schema
type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), // ✅ This connects Zod schema
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      grant_type: "password",
      client_id: "NurseryAdmin",
      scope: "autocode.read",
    },
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const { mutate: DoLogin, isPending, isError } = useLogin();

  // ✅ This is where you get form values on submit
  const onSubmit = (data: LoginFormData) => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      showToast(MESSAGES.OFFLINE_ERROR, ALERT_TYPES.ERROR);

      return; // 🚫 Don't proceed to mutation
    }
    //Prevents multiple API calls after submission:
    setIsButtonDisabled(true);
    DoLogin(data);
    // You can send this data to an API here
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      router.push("/dashboard"); // Redirect to login if not authenticated
    }
  }, [router]);

  useEffect(() => {
    if (isError) {
      setIsButtonDisabled(false);
    }
  }, [isError]);

  return (
    <>
      {isPending && <Loader />}

      <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-darkGreen">
            Sign In to your Account (Admin)
          </h1>
          <p className="text-sm text-peach">
            Welcome back! Please enter your details
          </p>
        </div>

        <div className="flex flex-col mb-3">
          <InputField
            type="text"
            placeholder="Email"
            icon="/icons/email.svg"
            {...register("username")}
            errorMessage={errors.username?.message}
          />

          <div className="relative mt-4">
            <InputField
              placeholder="Password"
              type={passwordVisible ? "text" : "password"}
              icon="/icons/lock.svg"
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                }
              }}
              {...register("password")}
              errorMessage={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible((prev) => !prev)}
              className="absolute right-3 top-4 z-10 cursor-pointer"
              title={passwordVisible ? "Hide password" : "Show password"}
              aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              <Image
                src={
                  passwordVisible ? "/icons/eye-off.svg" : "/icons/eye-on.svg"
                }
                alt="Toggle password visibility"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <button
            disabled={isButtonDisabled}
            type="submit"
            className="cursor-pointer bg-darkGreen text-white px-2 py-3 font-bold rounded-lg hover:brightness-90 md:w-56"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </form>
    </>
  );
};
