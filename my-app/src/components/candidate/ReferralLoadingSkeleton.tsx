import React from "react";

const ReferralLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-purple-100 text-[1.12rem] sm:text-base lg:text-[1.14rem] animate-pulse">
      {/* Header Skeleton */}
      <div className="w-full z-30 bg-white/80 dark:bg-gray-900/60 border-b border-white/30 dark:border-gray-800/40 shadow-lg max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between rounded-b-xl">
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-96"></div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-5 ml-12">
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-10"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Panel Skeleton */}
          <div className="lg:col-span-2 space-y-7">
            <div className="h-64 bg-gray-200 rounded-lg shadow-md"></div>
            <div className="h-96 bg-gray-200 rounded-lg shadow-md"></div>
            <div className="h-64 bg-gray-200 rounded-lg shadow-md"></div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-7">
            <div className="h-64 bg-gray-200 rounded-lg shadow-md"></div>
            <div className="h-96 bg-gray-200 rounded-lg shadow-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralLoadingSkeleton;
