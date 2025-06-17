import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Notifications from "@/components/Notifications";
import ReferralTimeline from "@/components/ReferralTimeline";
import ReferralDetails from "@/components/ReferralDetails";
import {
  PartyPopper,
  Users,
  Download,
  Mail,
  UserCog,
  CalendarCheck2,
  MessageCircleQuestion,
  FileCheck2,
} from "lucide-react";
import { useGetReferralQuery } from "@/api-service/candidate/candidate.api";
import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";

// Referral Data (Static)
const referralData = {
  id: "REF-2024-001",
  candidateName: "John Doe",
  position: "Senior Software Engineer",
  referredBy: "Sarah Johnson",
  submittedDate: "2024-01-15",
  currentStatus: "Interview Round 2",
  failed: false,
};

// Define all step names (static)
const allSteps = [
  "Referral Submitted",
  "Referral Under Review",
  "Referral Accepted",
  "Interview Round 1",
  "Interview Round 2",
  "Interview Round 3",
  "Final Result", // outcome, not part of progress calculation
];

// Fake corresponding dates (static)
const fakeDates = [
  "Jan 15, 2024",
  "Jan 18, 2024",
  "Jan 25, 2024",
  "Feb 5, 2024",
  "Feb 10, 2024",
  "Feb 12, 2024",
];

// Updated generateStatusSteps
function generateStatusSteps(currentCompletedStatus: string, failed: boolean) {
  const currentIndex = allSteps.findIndex(
    (step) => step === currentCompletedStatus
  );

  return allSteps.map((step, index) => {
    let status: "completed" | "current" | "pending" | "failed";
    let name = step;

    const isFinalStep = step === "Final Result";
    const isPast = index < currentIndex;
    const isCurrent = index === currentIndex;

    // Final Result naming logic
    if (isFinalStep) {
      if (failed || currentCompletedStatus === "Interview Round 3") {
        name = failed ? "Failed" : "Completed"; // Change label only at end
        status = failed ? "failed" : "completed";
      } else {
        name = "Final Result"; // Keep neutral label during progress
        status = "pending";
      }
    } else if (isPast) {
      status = "completed";
    } else if (isCurrent) {
      status = failed ? "failed" : "completed";
    } else if (index === currentIndex + 1 && !failed) {
      status = "current";
    } else {
      status = "pending";
    }

    if (failed && index > currentIndex) {
      status = "failed";
    }

    return {
      name,
      status,
      date: fakeDates[index] || "",
    };
  });
}

// Progress calculation excluding "Final Result"
function calculateProgress(currentStatus: string, failed: boolean): number {
  const processSteps = allSteps.slice(0, 6); // Exclude Final Result
  const currentIndex = processSteps.findIndex((s) => s === currentStatus);

  let completedCount = failed ? currentIndex : currentIndex + 1;

  if (completedCount < 0) completedCount = 0;
  if (completedCount > processSteps.length)
    completedCount = processSteps.length;

  return Math.round((completedCount / processSteps.length) * 100);
}

// Status color class
function getStatusColor(
  status: "completed" | "current" | "pending" | "failed"
) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "current":
      return "bg-blue-100 text-blue-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

// Main Component
export default function Index() {
  const params = useParams();
  const { data } = useGetReferralQuery(
    params.id ? { id: params.id } : skipToken
  );
  console.log("🚀 ~ data:", data);

  const statusSteps = generateStatusSteps(
    referralData.currentStatus,
    referralData.failed
  );
  const progress = calculateProgress(
    referralData.currentStatus,
    referralData.failed
  );

  const nextStep =
    statusSteps.find((step) => step.status === "pending")?.name ??
    "All steps completed";

  const displayStatus = (() => {
    const finalStep = statusSteps.find(
      (step) => step.name === "Completed" || step.name === "Failed"
    );
    if (finalStep && finalStep.status === "completed")
      return "Final Result: Completed";
    if (finalStep && finalStep.status === "failed")
      return "Final Result: Failed";

    const next = statusSteps.find(
      (step) => step.status === "current" || step.status === "pending"
    );
    return next?.name ?? "Completed";
  })();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-purple-100 text-[1.12rem] sm:text-base lg:text-[1.14rem]">
      {/* Header */}
      <div className="w-full z-30 bg-white/80 dark:bg-gray-900/60 border-b border-white/30 dark:border-gray-800/40 shadow-lg max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between rounded-b-xl fade-in-up">
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white drop-shadow-lg tracking-tight flex items-center gap-2">
              <PartyPopper className="inline mr-1 text-yellow-500" />
              Referral Tracking
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mt-1 text-base tracking-wide">
              Track your referral application progress and stay up to date 🎉
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-5 ml-12">
          <Badge className="text-lg px-6 py-2 rounded-lg bg-blue-100 text-blue-800 border border-blue-200 shadow font-semibold transition-colors duration-200 hover-scale animate-fade-in-up">
            {referralData.id}
          </Badge>
          <Notifications id={params.id || ""} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-7">
            {/* Current Status */}
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 hover-scale fade-in-up">
              <CardHeader className="mb-6">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="text-violet-600" />
                  Current Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge
                    className={`${getStatusColor(
                      referralData.failed ? "failed" : "current"
                    )} px-3 py-1 text-sm font-semibold`}
                  >
                    {referralData.failed ? "Failed" : displayStatus}
                  </Badge>
                  <span className="text-base text-gray-500">
                    {progress}% Complete
                  </span>
                </div>
                <Progress value={progress} className="h-2 mb-4" />
                {!referralData.failed && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-5 transition-colors duration-300">
                    <p className="text-base font-medium text-blue-900 mb-1">
                      Next Step
                    </p>
                    <p className="text-blue-800">{nextStep}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 hover-scale fade-in-up">
              <CardHeader className="mb-6">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <CalendarCheck2 className="text-blue-600" />
                  Application Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReferralTimeline steps={statusSteps} largerFont={true} />
              </CardContent>
            </Card>

            {/* Updates */}
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 hover-scale fade-in-up">
              <CardHeader className="mb-6">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MessageCircleQuestion className="text-emerald-600" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-400 transition-all duration-300">
                    <FileCheck2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900 text-lg">
                        Technical Interview Completed
                      </p>
                      <p className="text-sm text-green-700">
                        Great performance! Moving to final round.
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Jan 25, 2024 at 2:30 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400 transition-all duration-300">
                    <CalendarCheck2 className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 text-lg">
                        Interview Scheduled
                      </p>
                      <p className="text-sm text-blue-700">
                        Technical interview with the engineering team.
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Jan 22, 2024 at 10:15 AM
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-7 fade-in-up">
            <ReferralDetails data={referralData} />
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 hover-scale fade-in-up">
              <CardHeader className="mb-6">
                <CardTitle className="text-2xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-violet-50 hover:shadow-sm transition-all duration-200 hover-scale flex items-center gap-3">
                  <UserCog className="h-6 w-6 text-gray-500" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Update Contact Information
                    </p>
                    <p className="text-sm text-gray-600">
                      Keep your details current
                    </p>
                  </div>
                </button>
                <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:shadow-sm transition-all duration-200 hover-scale flex items-center gap-3">
                  <Download className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Download Application
                    </p>
                    <p className="text-sm text-gray-600">
                      Get a copy of your submission
                    </p>
                  </div>
                </button>
                <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-green-50 hover:shadow-sm transition-all duration-200 hover-scale flex items-center gap-3">
                  <Mail className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Contact HR
                    </p>
                    <p className="text-sm text-gray-600">
                      Get help with your application
                    </p>
                  </div>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
