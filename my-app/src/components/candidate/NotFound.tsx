import React from "react";
import { Frown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-purple-100 text-gray-800">
      <div className="bg-white p-10 rounded-lg shadow-xl text-center max-w-md mx-auto">
        <Frown className="w-24 h-24 text-blue-500 mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The referral you are looking for does not exist or has been
          moved.
        </p>
      </div>
    </div>
  );
}
