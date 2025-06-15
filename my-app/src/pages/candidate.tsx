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

// Decorative Unsplash image URL for the header
// Removed headerImg as images are no longer needed

const referralData = {
  id: "REF-2024-001",
  candidateName: "John Doe",
  position: "Senior Software Engineer",
  referredBy: "Sarah Johnson",
  department: "Engineering",
  submittedDate: "2024-01-15",
  currentStatus: "Technical Interview",
  progress: 60,
  nextStep: "Final Interview with VP Engineering",
  estimatedCompletion: "2024-02-10",
};

// Use strict types for status
const statusSteps = [
  {
    name: "Application Submitted",
    status: "completed" as const,
    date: "Jan 15, 2024",
  },
  {
    name: "Initial Screening",
    status: "completed" as const,
    date: "Jan 18, 2024",
  },
  {
    name: "Technical Interview",
    status: "current" as const,
    date: "Jan 25, 2024",
  },
  { name: "Final Interview", status: "pending" as const, date: "Feb 5, 2024" },
  { name: "Decision", status: "pending" as const, date: "Feb 10, 2024" },
];

function getStatusColor(status: "completed" | "current" | "pending") {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "current":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-purple-100 text-[1.12rem] sm:text-base lg:text-[1.14rem]">
      {/* Header (livelier style) */}
      <div
        className="
          w-full z-30 transition-all duration-500
          bg-white/80 dark:bg-gray-900/60
          border-b border-white/30 dark:border-gray-800/40
          shadow-lg
          max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8
          flex items-center justify-between
          rounded-b-xl
          fade-in-up
        "
      >
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
        {/* Referral ID and Notification Bell side by side & more spacing */}
        <div className="flex flex-row items-center gap-5 ml-12">
          <Badge className="text-lg px-6 py-2 rounded-lg bg-blue-100 text-blue-800 border border-blue-200 shadow font-semibold transition-colors duration-200 hover-scale animate-fade-in-up">
            {referralData.id}
          </Badge>
          <Notifications />
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-7">
            {/* Current Status Card */}
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
                      "current"
                    )} px-3 py-1 text-sm font-semibold`}
                  >
                    {referralData.currentStatus}
                  </Badge>
                  <span className="text-base text-gray-500">
                    {referralData.progress}% Complete
                  </span>
                </div>
                <Progress value={referralData.progress} className="h-2 mb-4" />
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-5 transition-colors duration-300">
                  <p className="text-base font-medium text-blue-900 mb-1">
                    Next Step
                  </p>
                  <p className="text-blue-800">{referralData.nextStep}</p>
                  <p className="text-xs text-blue-600 mt-2">
                    Estimated completion: {referralData.estimatedCompletion}
                  </p>
                </div>
              </CardContent>
            </Card>
            {/* Progress Timeline */}
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 hover-scale fade-in-up">
              <CardHeader className="mb-6">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <CalendarCheck2 className="text-blue-600" />
                  Application Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* uniform size already applied in ReferralTimeline via largerFont */}
                <ReferralTimeline steps={statusSteps} largerFont={true} />
              </CardContent>
            </Card>
            {/* Recent Updates */}
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
            {/* Quick Actions */}
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
