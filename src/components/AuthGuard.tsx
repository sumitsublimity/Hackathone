"use client";

// Framework imports
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Local imports
import { Loader } from "./Loader";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      setIsAuthenticated(true);
    } else {
      router.push("/"); // Redirect to login if not authenticated
    }

    setIsChecking(false);
  }, [router]);

  if (isChecking) return <Loader />;

  return isAuthenticated ? <>{children}</> : null;
};
