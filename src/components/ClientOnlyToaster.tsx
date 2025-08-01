"use client";

import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export function ClientOnlyToaster() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <Toaster position="top-center" />;
}
