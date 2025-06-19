import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import Notifications from "@/components/candidate/Notifications";
import ReferralTimeline from "@/components/candidate/ReferralTimeline";
import ReferralDetails from "@/components/candidate/ReferralDetails";
import type { ReferralsResponse } from "@/api-service/candidate/types";
import ReferralLoadingSkeleton from "@/components/candidate/ReferralLoadingSkeleton";
import NotFound from "@/components/candidate/NotFound";

// Referral Data (Static)
// const referralData = {
//   id: "REF-2024-001",
//   candidateName: "John Doe",
//   position: "Senior Software Engineer",
//   referredBy: "Sarah Johnson",
//   submittedDate: "2024-01-15",
//   currentStatus: "Interview Round 2",
//   failed: false,
// };

type FormattedStep = {
  name: string;
  date: string;
  rawStatus: string;
};

type ReferralData = {
  id: string;
  candidateName: string;
  position: string;
  referredBy: string;
  submittedDate: string;
  currentStatus: string;
  failed: boolean;
  formattedSteps: FormattedStep[];
};

const statusMap: Record<string, string> = {
  "Referral Submitted": "Referral Submitted",
  "Referral Under Review": "Referral Under Review",
  "Referral Accepted": "Referral Accepted",
  "Interviews Round 1": "Interview Round 1",
  "Interview Round 2": "Interview Round 2",
  Rejected: "Rejected",
  Accepted: "Accepted",
};

function buildReferralData(apiResponse: ReferralsResponse): ReferralData {
  const {
    candidateName,
    currentStatus,
    failedAt,
    histories,
    id,
    position,
    referredBy,
    submittedDate,
  } = apiResponse;

  const formattedSteps: FormattedStep[] = histories.map((entry) => ({
    name: statusMap[entry.status] || entry.status,
    date: new Date(entry.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    rawStatus: entry.status,
  }));

  const failed = currentStatus === "Rejected";

  return {
    id: `REF-${id}`.padStart(10, "0"),
    candidateName,
    position,
    referredBy,
    submittedDate: new Date(submittedDate).toISOString().split("T")[0],
    currentStatus: statusMap[failedAt || currentStatus] || currentStatus,
    failed,
    formattedSteps,
  };
}

// Define all step names (static)
const allSteps = [
  "Referral Submitted",
  "Referral Under Review",
  "Referral Accepted",
  "Interview Round 1",
  "Interview Round 2",
  "Final Result", // final step (conditionally becomes "Completed")
];

function buildFakeDatesFromHistories(
  histories: { status: string; createdAt: string }[],
  failedAt?: string
): string[] {
  const stepToDateMap: Record<string, string> = {};

  // Step 1: Convert raw status -> formatted date
  console.log("Data histories", histories);
  for (const h of histories) {
    if (!stepToDateMap[h.status]) {
      const formatted = new Date(h.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      stepToDateMap[h.status] = formatted;
    }
  }

  // Step 2: Check if status was Accepted
  const isAccepted = histories.some((h) => h.status === "Accepted");
  const acceptedDate = stepToDateMap["Accepted"] || "";

  const result: string[] = [];

  for (let i = 0; i < allSteps.length; i++) {
    const step = allSteps[i];

    // Stop early if failed and step is after the failure
    if (failedAt && !isAccepted) {
      const stopIndex = allSteps.findIndex((s) => s === statusMap[failedAt]);
      if (i > stopIndex) break;
    }

    const raw = Object.entries(statusMap).find(([, v]) => v === step)?.[0];

    if (raw && stepToDateMap[raw]) {
      result.push(stepToDateMap[raw]);
    } else if (isAccepted) {
      result.push(acceptedDate); // Fill accepted date if available
    } else {
      result.push(""); // No date for step
    }
  }

  return result;
}

// Updated generateStatusSteps
function generateStatusSteps(
  currentCompletedStatus: string, // Already raw status from API
  failed: boolean,
  fakeDates: string[]
) {
  console.log("🚀 ~ currentCompletedStatus:", currentCompletedStatus);
  const isAccepted = currentCompletedStatus === "Accepted";

  const failureStep =
    statusMap[currentCompletedStatus] || currentCompletedStatus;
  const failedIndex = allSteps.findIndex((step) => step === failureStep);

  return allSteps.map((step, index) => {
    let status: "completed" | "current" | "pending" | "failed";
    let name = step;

    // ✅ All steps completed if Accepted
    if (isAccepted) {
      status = "completed";
      name = step === "Final Result" ? "Selected" : step;
    }

    // ❌ If Rejected or failed
    else if (failed) {
      if (index < failedIndex) {
        status = "completed";
      } else if (index === failedIndex) {
        status = "failed";
        name = name === "Final Result" ? "Rejected" : name;
      } else {
        status = "failed";
        name = name === "Final Result" ? "Rejected" : name;
      }
    }

    // ⏳ Normal case
    else {
      if (index <= failedIndex) {
        status = "completed";
      } else if (index === failedIndex + 1) {
        status = "current";
      } else {
        status = "pending";
      }
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
  const totalSteps = allSteps.length;
  let currentIndex;
  if (currentStatus === "Accepted" || currentStatus === "Rejected") {
    currentIndex = allSteps.length - 1; // Last step is "Final Result"
  } else {
    currentIndex = allSteps.findIndex((s) => s === currentStatus);
  }
  console.log("🚀 ~ currentIndex:", currentIndex);

  let completedCount = 0;

  if (currentStatus === "Accepted") {
    completedCount = totalSteps;
  } else if (failed) {
    completedCount = currentIndex;
  } else {
    completedCount = currentIndex + 1;
  }

  if (completedCount < 0) completedCount = 1;
  if (completedCount > totalSteps) completedCount = totalSteps;

  return Math.round((completedCount / totalSteps) * 100);
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
  let { id } = useParams();
  console.log("🚀 ~ Index ~ params.id:", id);

  const { data, isLoading } = useGetReferralQuery(id ? id : skipToken);
  console.log("🚀 ~ data:", data);

  if (isLoading) {
    return <ReferralLoadingSkeleton />;
  }

  const referralData: ReferralData | null = data
    ? buildReferralData(data)
    : null;
  if (!referralData) {
    return <NotFound />;
  }

  const fakeDates = data
    ? buildFakeDatesFromHistories(data.histories, data.failedAt)
    : [];
  console.log("Fake_dates: ", fakeDates);

  const statusSteps = generateStatusSteps(
    referralData.currentStatus,
    referralData.failed,
    fakeDates
  );
  console.log("statusSteps: ", statusSteps);
  const progress = calculateProgress(
    referralData.currentStatus,
    referralData.failed
  );

  // Find current and next status steps
  const currentStep = statusSteps.find((step) => step.status === "current");
  const nextPendingStep = statusSteps.find((step) => step.status === "pending");

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
          <Notifications id={id || ""} />
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
                    )} px-4 py-2 text-lg font-bold`}
                  >
                    {referralData.failed
                      ? "Failed"
                      : currentStep
                      ? currentStep.name
                      : displayStatus}
                  </Badge>
                  <span className="text-base text-gray-500">
                    {progress}% Complete
                  </span>
                </div>
                <Progress value={progress} className="h-2 mb-4" />
                {!referralData.failed && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-5 transition-colors duration-300">
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      Next Step
                    </p>
                    <p className="text-blue-700 text-sm">
                      {nextPendingStep
                        ? nextPendingStep.name
                        : "All steps completed"}
                    </p>
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
            {/* <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 hover-scale fade-in-up">
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
            </Card> */}
          </div>

          {/* Sidebar */}
          <div className="space-y-7 fade-in-up">
            <ReferralDetails data={referralData} />
          </div>
        </div>
      </div>
    </div>
  );
}