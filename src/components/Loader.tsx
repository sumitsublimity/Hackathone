import React from "react";

export const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="h-12 w-12 border-4 border-peach border-t-transparent rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  );
};
