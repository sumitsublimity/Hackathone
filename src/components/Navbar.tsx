"use client";

// Framework imports:
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// Local imports:
import defaultUser from "@/../public/icons/default-user.svg";
import Down_arrow from "@/../public/icons/down_arrow.svg";
import { ChangePassword } from "./ChangePassword";
// Libraries imports:
import { KeyRound, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { SidebarTrigger } from "./ui/sidebar";

export const Navbar = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    userName: "",
    userRole: "",
  });

  const handleLogout = () => {
    [
      "access_token",
      "refresh_token",
      "userName",
      "userRole",
      "userEmail",
    ].forEach((key) => {
      localStorage.removeItem(key);
    });

    router.push("/");
  };

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");

    if (userName && userRole) {
      setUserDetails({ userName, userRole });
    } else {
      console.warn("User details not found in localStorage.");
    }
  }, []);

  return (
    <>
      <nav className="bg-[var(--background)] w-full flex items-center justify-between  px-4 py-3 sm:px-7.5 h-[72px] lg:h-[76px]">
        {/* Logo + Sidebar trigger for mobile */}
        <div className="flex items-center gap-4 lg:hidden w-full sm:mb-0">
          <Link href="/dashboard" className="flex-shrink-0">
            <Image
              src="/logo/sidebar-header.svg"
              alt="logo"
              width={140}
              height={40}
              className="object-contain"
            />
          </Link>
          <SidebarTrigger className="p-0">
            <button
              className="rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent shadow-none"
              aria-label="Toggle Sidebar"
            >
              <Image
                src="/icons/henburgIcon.svg"
                alt="Toggle Sidebar"
                width={24}
                height={24}
                className="object-contain"
              />
            </button>
          </SidebarTrigger>
        </div>

        {/* Right side: User info and dropdown */}
        <div className="flex items-center gap-4 ml-auto flex-shrink-0">
          <DropdownMenu
            modal={false}
            open={isAccountDropdownOpen}
            onOpenChange={setIsAccountDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <div
                className="flex items-center cursor-pointer gap-2 max-w-[90vw] sm:max-w-none overflow-hidden"
                aria-haspopup="true"
                aria-expanded={isAccountDropdownOpen}
              >
                <Avatar>
                  <AvatarImage src="/icons/default-user.svg" />
                  <AvatarFallback>
                    <Image src={defaultUser} alt="default user" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start truncate min-w-0">
                  <div className="font-bold text-sm leading-relaxed text-darkGreen truncate">
                    {userDetails.userName || "User"}
                  </div>
                  <div className="text-xs font-normal text-slateGreen truncate">
                    {userDetails.userRole || "Role"}
                  </div>
                </div>
                <Image
                  className="cursor-pointer shrink-0"
                  src={Down_arrow}
                  alt="Arrow"
                />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="mt-5 px-2 w-56 text-slateGreen border border-gray-200 bg-white rounded-md shadow-md"
            >
              <DropdownMenuLabel className="text-darkGreen text-md font-bold">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-lightTeal my-1" />
              <DropdownMenuItem
                className="focus:text-accent-offWhite focus:bg-accent"
                onSelect={(e) => {
                  e.preventDefault();
                  setIsDialogOpen(true);
                  setIsAccountDropdownOpen(false);
                }}
              >
                <KeyRound className="h-5 w-5 mr-2 text-slateGreen" />
                Change Password
              </DropdownMenuItem>

              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Change Password Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="hidden" />
          <DialogContent
            className="scale-[0.8]"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <ChangePassword
              onCancel={() => {
                setIsDialogOpen(false);
                setIsAccountDropdownOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </nav>
    </>
  );
};
