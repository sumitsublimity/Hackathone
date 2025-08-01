"use client";

import React, { useEffect } from "react";
import useNetwork from "@/hooks/useNetwork";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";
import { showToast } from "@/utils/alert";

const NetworkStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const isOnline = useNetwork();

  useEffect(() => {
    if (!isOnline) {
      showToast(MESSAGES.OFFLINE_ERROR, ALERT_TYPES.ERROR);
    }
  }, [isOnline]);

  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default NetworkStatusProvider;
