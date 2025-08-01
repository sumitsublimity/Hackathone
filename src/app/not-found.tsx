"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12 text-center">
      <div className="max-w-md">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-xl text-gray-700">Page Not Found</p>
        <p className="mt-2 text-sm text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link href="/dashboard">
          <Button className="mt-6 inline-flex items-center gap-2 text-sm cursor-pointer">
            <ArrowLeft size={16} />
            Go back home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
