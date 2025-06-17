import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Users,
  TrendingUp,
  Plus,
  Sparkles,
  Target,
  Award,
} from "lucide-react";
import JobBrowser from "./jobBrowser";
import ReferralForm from "./referralForm";
import MyReferrals from "./myReferral";
import type { Job, Referral, User } from "@/types";
import { useGetJobsListQuery } from '@/api-service/job/job.api';

// Local mock data
const mockReferrals: Referral[] = [
  {
    id: "1",
    jobId: "1",
    jobTitle: "Senior Software Engineer",
    referrerId: "1",
    referrerName: "John Doe",
    candidateName: "Jane Smith",
    candidateEmail: "jane.smith@email.com",
    candidatePhone: "+1-555-0123",
    status: "under_review",
    submittedAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-17"),
    referralCode: "REF-001",
    bonusEligible: false,
    bonusPaid: false,
    // trackingToken: 'employee-dashboard-token-123'
  },
];

interface EmployeeDashboardProps {
  user: User;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user }) => {
  const { data: jobs = [], isLoading: jobsLoading } = useGetJobsListQuery({});
  const [referrals] = useState<Referral[]>(mockReferrals);
  const [selectedJobForReferral, setSelectedJobForReferral] = useState<
    number | null
  >(null);

  const activeJobs = jobsLoading ? 0 : jobs.filter((job) => job.deletedAt === null).length;
  const myReferrals = referrals.filter((r) => r.referrerId === user?.id).length;
  const acceptedReferrals = referrals.filter(
    (r) => r.referrerId === user?.id && r.status === "accepted"
  ).length;

  const stats = [
    {
      title: "Available Jobs",
      value: activeJobs,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      trend: `${activeJobs} open`,
    },
    {
      title: "My Referrals",
      value: myReferrals,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      trend: "Total sent",
    },
    {
      title: "Successful Referrals",
      value: acceptedReferrals,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      trend: `₹${acceptedReferrals * 75000} earned`,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 p-8 text-white animate-scale-in">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='60' cy='60' r='30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="relative flex justify-between items-center">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-blue-200 text-lg">
                  Discover opportunities and grow your network
                </p>
              </div>
            </div>
          </div>
          <div className="animate-float">
            <Sparkles className="h-12 w-12 text-blue-300 opacity-60" />
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`card-hover glass border-0 ${stat.bgColor} animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">{stat.trend}</p>
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-xl ${stat.color
                      .replace("text-", "bg-")
                      .replace("-600", "-100")}`}
                  >
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Main Content */}
      <div
        className="animate-slide-in-right"
        style={{ animationDelay: "300ms" }}
      >
        <Tabs defaultValue="jobs" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-3 w-fit bg-white/70 backdrop-blur-sm border shadow-lg rounded-xl p-1">
              <TabsTrigger
                value="jobs"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
              >
                Browse Jobs
              </TabsTrigger>
              <TabsTrigger
                value="referrals"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all duration-300"
              >
                My Referrals
              </TabsTrigger>
              <TabsTrigger
                value="rewards"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
              >
                Rewards
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="jobs" className="animate-fade-in">
            {selectedJobForReferral !== null ? (
              <Card className="glass border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r p-4 from-blue-50 to-indigo-50 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl text-gray-900 flex items-center">
                        <Users className="h-6 w-6 mr-2 text-blue-600" />
                        Refer a Candidate
                      </CardTitle>
                      <p className="text-gray-600 mt-1">
                        Help us find the perfect match
                      </p>
                    </div>
                    <Button
                      onClick={() => setSelectedJobForReferral(null)}
                      variant="outline"
                      className="bg-white/70 backdrop-blur-sm"
                    >
                      Back to Jobs
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 animate-scale-in">
                  <ReferralForm
                    jobId={selectedJobForReferral}
                    user={user}
                    jobs={jobs}
                    onCancel={() => setSelectedJobForReferral(null)}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="animate-slide-in-right">
                <JobBrowser 
                  jobs={jobs}
                  isLoading={jobsLoading}
                  onReferClick={(jobId) => setSelectedJobForReferral(jobId)}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="referrals" className="animate-fade-in">
            <div className="animate-slide-in-right">
              <MyReferrals />
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="animate-fade-in">
            <Card className="glass border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <Award className="h-6 w-6 mr-2 text-purple-600" />
                  Referral Rewards Program
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  Track your earnings and unlock achievements
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Reward Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Total Earned
                          </h3>
                          <p className="text-2xl font-bold text-green-600">
                            ₹{acceptedReferrals * 75000}
                          </p>
                          <p className="text-sm text-gray-600">
                            From {acceptedReferrals} successful referrals
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Target className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Potential Earnings
                          </h3>
                          <p className="text-2xl font-bold text-blue-600">
                            ₹{(myReferrals - acceptedReferrals) * 75000}
                          </p>
                          <p className="text-sm text-gray-600">
                            From {myReferrals - acceptedReferrals} pending
                            referrals
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reward Info */}
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl border border-purple-200 animate-bounce-in">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                        <Award className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          How It Works
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p>
                            <strong>₹75,000 bonus</strong> for each
                            successful referral
                          </p>
                          <p>
                             <strong>6 months employment</strong> required for
                            payout
                          </p>
                          <p>
                             <strong>No limit</strong> on the number of
                            referrals you can make
                          </p>
                          <p>
                            <strong>Monthly bonuses</strong> for top
                            performers
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
