"use client";

import React from "react";
import AppSidebar from "@/components/AppSidebar";
import { AuthGuard } from "@/components/AuthGuard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { usePathname } from "next/navigation";
import { LoadingProvider } from "./LoadingContext"; 

interface Props {
  children: React.ReactNode;
  defaultOpen?: boolean;
}
const queryClient = new QueryClient();

export default function ClientLayout({ children }: Props) {
  const pathname = usePathname();

  const layoutExcludedRoutes = ["/", "/404"];
  const isLayoutExcluded = layoutExcludedRoutes.includes(pathname);

  if (isLayoutExcluded) {
    return <>{children}</>; // ✅ Skip layout and auth
  }

  return (
    <AuthGuard>
      <QueryClientProvider client={queryClient}>
    <LoadingProvider>
        <div className="flex bg-[var(--font-lightGray)]">
          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <div className="w-full h-screen bg-offWhite overflow-hidden flex flex-col">
              <Navbar />
              {children}
            </div>
          </SidebarProvider>
        </div>
    </LoadingProvider>
      </QueryClientProvider>
    </AuthGuard>
  );
}
