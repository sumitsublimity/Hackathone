"use client";

import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Bullet_icon from "@/../public/icons/bullet_icon.svg";
import Active_bullet_icon from "@/../public/icons/active_bullet_icon.svg";
import sidebarHeader from "@/../public/logo/sidebar-header.svg";
import {
  ComplianceMatrixIcon,
  DashboardIcon,
  FormsDirectoryIcon,
  ManagementJobTrackerIcon,
  ReportsIcon,
  SiteManagementIcon,
  StaffManagementIcon,
  StrategyAndPlanningIcon,
} from "@/utils/icons";
import { Menu, X } from "lucide-react";
import Button from "./Button";

const items = [
  {
    title: "Dashboard",
    icon: <DashboardIcon fill="currentColor" height="25" width="25" />,
    url: "/dashboard",
  },
  {
    title: "Site Management",
    icon: (
      <SiteManagementIcon fill={"currentColor"} height={"25"} width={"25"} />
    ),
    subItems: [
      {
        subTitle: "Site List",
        url: "/site-management/site-list",
      },
      {
        subTitle: "Add Site",
        url: "/site-management/add-site/0",
      },
    ],
  },
  {
    title: "Staff Management",
    icon: (
      <StaffManagementIcon fill={"currentColor"} height={"25"} width={"25"} />
    ),
    subItems: [
      {
        subTitle: "Staff List",
        url: "/staff-management/staff-list",
      },
      {
        subTitle: "Add Staff",
        url: "/staff-management/add-staff/0",
      },
    ],
  },

  {
    title: "Strategy & Planning",
    icon: (
      <StrategyAndPlanningIcon fill="currentColor" height="25" width="25" />
    ),
    subItems: [
      {
        subTitle: "KPI Dashboard",
        url: "/strategy-and-planning/kpi-dashboard",
      },
      {
        subTitle: "Budget",
        url: "/strategy-and-planning/budget",
      },
      {
        subTitle: "Hours & Costing",
        url: "/strategy-and-planning/hours-and-costing",
      },
      {
        subTitle: "Hours Sold",
        url: "/strategy-and-planning/hours-sold",
      },
      {
        subTitle: "Enquiries",
        url: "/strategy-and-planning/enquiries",
      },
      {
        subTitle: "S&P Data",
        url: "/strategy-and-planning/sp-data",
      },
    ],
  },

  {
    title: "Management Job Tracker",
    icon: (
      <ManagementJobTrackerIcon fill="currentColor" height="25" width="25" />
    ),
    subItems: [
      {
        subTitle: "Goals",
        url: "/management-job-tracker/goals",
      },
      {
        subTitle: "Task Tracker",
        url: "/management-job-tracker/task-tracker",
      },
      {
        subTitle: "Holiday List",
        url: "/management-job-tracker/holiday-list",
      },
    ],
  },
  {
    title: "Compliance Matrix",
    icon: <ComplianceMatrixIcon fill="currentColor" height="25" width="25" />,
    subItems: [
      {
        subTitle: "Policies",
        // TODO: Add this route
        url: "/dashboard/policies",
      },
      {
        subTitle: "Users",
        // TODO: Add this route
        url: "/dashboard/users",
      },
      {
        subTitle: "H & S Training Log",
        // TODO: Add this route
        url: "/dashboard/training_log",
      },
    ],
  },
  {
    title: "Forms Directory",
    icon: <FormsDirectoryIcon fill="currentColor" height="25" width="25" />,
    // TODO: Add this route
    url: "/forms-directory",
  },
  {
    title: "Reports",
    icon: <ReportsIcon fill="currentColor" height="25" width="25" />,
    // TODO: Add this route
    url: "",
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  // Get from your sidebar context:
  const { open, openMobile, isMobile, toggleSidebar } = useSidebar();

  // Determine if sidebar is open based on device:
  const sidebarOpen = isMobile ? openMobile : open;

  const toggleSubmenu = (title: string) => {
    setOpenMenu((prev) => (prev === title ? null : title));
  };

  return (
    <>
      <Sidebar
        collapsible="none"
        className={`
          fixed left-0 w-[100%] sm:w-[320px] lg:w-86 z-40
          transition-transform backdrop-blur-md bg-white/80 shadow-md
          lg:relative lg:translate-x-0
          top-[72px] lg:top-0
           h-[calc(100vh-72px)] lg:h-screen
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarHeader className="hidden lg:flex items-center justify-center h-[72px] lg:h-[76px] bg-white py-2 px-5">
          <Link href="/dashboard" className="w-full h-full">
            <Image
              src={sidebarHeader}
              alt="logo"
              width={100}
              height={100}
              className="object-contain w-full h-full"
            />
          </Link>
        </SidebarHeader>

        <SidebarContent className="p-4 overflow-y-auto h-full">
          <SidebarMenu>
            {items.map((item) => {
              const activeParent =
                pathname === item.url ||
                item.subItems?.some((s) => pathname === s.url);
              const openSubmenu = openMenu === item.title;

              return (
                <React.Fragment key={item.title}>
                  <SidebarMenuItem>
                    {item.subItems ? (
                      <SidebarMenuButton
                        onClick={() => toggleSubmenu(item.title)}
                        className={`flex w-full items-center p-2 rounded-lg gap-2
                        ${activeParent
                            ? "bg-beige text-darkGreen font-bold"
                            : "text-slateGreen hover:bg-sidebarHover"
                          }`}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        className={`flex w-full items-center p-2 rounded-lg gap-2
                        ${activeParent
                            ? "bg-beige text-darkGreen font-bold"
                            : "text-slateGreen hover:bg-sidebarHover"
                          }`}
                      >
                        <Link
                          href={item.url}
                          onClick={() => {
                            if (isMobile) toggleSidebar();
                          }}
                        >
                          <span className="flex items-center gap-2">
                            {item.icon}
                            <span>{item.title}</span>
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>

                  {item.subItems && openSubmenu && (
                    <div className="ml-6">
                      {item.subItems.map((sub) => {
                        const isActive = pathname === sub.url;
                        return (
                          <SidebarMenuItem key={sub.subTitle}>
                            <SidebarMenuButton
                              asChild
                              className={`flex items-center gap-2 px-2 py-1 rounded text-sm
                              ${isActive
                                  ? "bg-beige text-darkGreen font-bold"
                                  : "text-slateGreen hover:bg-sidebarHover"
                                }`}
                            >
                              <Link
                                href={sub.url}
                                onClick={() => {
                                  if (isMobile) toggleSidebar();
                                }}
                              >
                                <span className="flex items-center gap-2">
                                  <Image
                                    src={
                                      isActive
                                        ? Active_bullet_icon
                                        : Bullet_icon
                                    }
                                    alt=""
                                    width={12}
                                    height={12}
                                  />
                                  <span>{sub.subTitle}</span>
                                </span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      {/* {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/25 z-30 md:hidden"
          onClick={toggleSidebar} // close sidebar on overlay click
        />
      )} */}
    </>
  );
};

export default AppSidebar;
