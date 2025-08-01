import React from "react";

export const TableLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center z-50 m-12">
      <div
        className="h-12 w-12 border-4 border-peach border-t-transparent rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  );
};
