import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Share2,
  Copy,
  ArrowLeft,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Heart,
  Coffee,
  Shield,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import ReferralForm from "@/pages/employee/referralForm";
import { useGetJobQuery } from "@/api-service/job/job.api"; // Adjust the import path as needed
import type { User } from "@/types";

interface JobDetailsProps {
  user?: User;
}

const JobDetails: React.FC<JobDetailsProps> = ({ user }) => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isReferralFormOpen, setIsReferralFormOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Fetch job data from API
  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useGetJobQuery({ id: jobId });
  console.log("🚀 ~ job:", job);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full animate-fade-in shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Loading Job Details
            </h1>
            <p className="text-gray-600">
              Please wait while we fetch the job information...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full animate-fade-in shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Briefcase className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {isError ? "Error Loading Job" : "Job Not Found"}
            </h1>
            <p className="text-gray-600 mb-6">
              {isError
                ? "There was an error loading the job details. Please try again."
                : "The job posting you're looking for doesn't exist."}
            </p>
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
            >
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/job/${jobId}`;
  const isAuthenticated = !!localStorage.getItem("token");

  // Calculate job statistics from API data
  const daysPosted = Math.floor(
    (new Date().getTime() - new Date(job.createdAt).getTime()) /
      (1000 * 3600 * 24)
  );
  const filledPositions = job.numOfPositions - job.remainingPositions;
  const totalReferrals = job.referrals?.length || 0;

  // Parse skills from comma-separated string
  const skillsArray = job.skills
    ? job.skills.split(",").map((skill) => skill.trim())
    : [];

  // Split skills into required and preferred (first 70% are required)
  const requiredSkills = skillsArray.slice(
    0,
    Math.ceil(skillsArray.length * 0.7)
  );
  const preferredSkills = skillsArray.slice(
    Math.ceil(skillsArray.length * 0.7)
  );

  // Format salary display
  const formatSalary = (salary: number) => {
    if (salary >= 10000000) {
      return `₹${(salary / 10000000).toFixed(1)} Cr`;
    } else if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(1)} L`;
    } else {
      return `₹${salary.toLocaleString()}`;
    }
  };

  // Format experience display
  const formatExperience = (experience: number) => {
    if (experience === 0) return "Fresher";
    if (experience === 1) return "1 year";
    return `${experience}+ years`;
  };

  // General company benefits
  const benefits = [
    {
      icon: Heart,
      title: "Health Insurance",
      description: "Medical, dental, and vision coverage",
    },
    {
      icon: Coffee,
      title: "Paid Time Off",
      description: "Vacation and sick leave",
    },
    {
      icon: Shield,
      title: "Retirement Plan",
      description: "401(k) with company matching",
    },
    {
      icon: GraduationCap,
      title: "Learning & Development",
      description: "Professional growth opportunities",
    },
  ];

  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job posting: ${job.title}`,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-5xl mx-auto p-6 animate-fade-in">
        {/* Header with back button */}
        {isAuthenticated && (
          <div className="mb-8 animate-slide-in-right">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="group flex items-center bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Button>
          </div>
        )}

        {/* Job Details Card */}
        <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 animate-scale-in">
          <CardHeader className="pb-6 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-4 font-bold animate-fade-in">
                  {job.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-6 text-sm text-blue-100">
                  <span className="flex items-center hover:text-white transition-colors">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </span>
                  <span className="flex items-center hover:text-white transition-colors">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {formatSalary(job.salary)}
                  </span>
                  <span className="flex items-center hover:text-white transition-colors">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatExperience(job.experience)}
                  </span>
                  <span className="flex items-center hover:text-white transition-colors">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(job.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-3">
                <Badge
                  className={`${
                    job.remainingPositions > 0
                      ? "bg-green-500/20 text-green-100 border-green-400"
                      : "bg-gray-500/20 text-gray-100 border-gray-400"
                  } backdrop-blur-sm animate-pulse`}
                >
                  {job.remainingPositions > 0 ? "Active" : "Filled"}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
                >
                  <Users className="h-3 w-3 mr-1" />
                  {job.remainingPositions} positions available
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 p-8">
            {/* Job Description */}
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-3"></div>
                Job Description
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {job.description}
              </p>
            </div>

            {/* Job Statistics */}
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full mr-3"></div>
                Job Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    {totalReferrals}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Referrals
                  </div>
                </div>
                <div className="group bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-300">
                    {daysPosted}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Days Posted
                  </div>
                </div>
                <div className="group bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">
                    {filledPositions}/{job.numOfPositions}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Positions Filled
                  </div>
                </div>
              </div>
            </div>

            {/* Skills/Requirements */}
            {skillsArray.length > 0 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                  <div className="w-1 h-6 bg-gradient-to-b from-green-600 to-teal-600 rounded-full mr-3"></div>
                  Required Skills
                </h3>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 text-red-600 mr-3" />
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {requiredSkills.map((skill, index) => (
                        <Badge
                          key={skill}
                          className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200 transition-colors duration-200 animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {preferredSkills.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                        <AlertCircle className="h-5 w-5 text-blue-600 mr-3" />
                        Preferred Skills
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {preferredSkills.map((skill, index) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200 transition-colors duration-200 animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Benefits & Perks */}
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-pink-600 to-rose-600 rounded-full mr-3"></div>
                Benefits & Perks
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="group flex items-start space-x-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex-shrink-0 p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300">
                      <benefit.icon className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-2">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral Bonus */}
            {isAuthenticated && job.bonusForReferral > 0 && (
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 animate-fade-in">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-blue-800 font-medium">
                    💰 <strong>Referral Bonus:</strong> Earn ₹
                    {job.bonusForReferral.toLocaleString()} when your referral
                    gets hired and stays for 6 months
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200 animate-fade-in">
              <Button
                onClick={handleShare}
                variant="outline"
                className="group bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 transition-all duration-300 transform hover:scale-105"
              >
                <Share2 className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Share Job Posting
              </Button>

              {isAuthenticated && (
                <Button
                  onClick={() => setIsReferralFormOpen(true)}
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                >
                  <UserPlus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Refer Someone
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Share Dialog */}
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent className="bg-white/95 backdrop-blur-sm animate-scale-in">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Share Job Posting
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-3 font-medium">
                  Job posting link:
                </p>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 p-3 border rounded-lg bg-gray-50 text-sm focus:bg-white transition-colors duration-300"
                  />
                  <Button
                    onClick={handleCopyLink}
                    size="sm"
                    className={`transition-all duration-300 ${
                      copySuccess
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copySuccess ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              {navigator.share && (
                <Button
                  onClick={handleNativeShare}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share via Device
                </Button>
              )}

              <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                This link can be shared with anyone. Candidates can view the job
                details without logging in.
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Referral Form Dialog */}
        {isAuthenticated && user && (
          <Dialog
            open={isReferralFormOpen}
            onOpenChange={setIsReferralFormOpen}
          >
            <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm animate-scale-in">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Refer a Candidate
                </DialogTitle>
              </DialogHeader>
              <ReferralForm
                jobId={jobId!}
                user={user}
                onCancel={() => setIsReferralFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
