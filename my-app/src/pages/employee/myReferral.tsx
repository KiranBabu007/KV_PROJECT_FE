import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, Code, Search } from "lucide-react";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetEmployeeReferralsQuery } from "@/api-service/referrals/referrals.api";
import { Input } from "@/components/ui/input";

type MyJwtPayload = {
  personId: number;
  employeeId: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

type Referral = {
  id: string;
  jobId: string;
  jobTitle: string;
  referrerId: string;
  referrerName: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  status: string;
  submittedAt: Date;
  updatedAt: Date;
  referralCode: string;
  bonusEligible: boolean;
  bonusPaid: boolean;
  trackingToken: string;
  createdAt: Date;
  deletedAt: Date | null;
  // notes?: string; // This property is not present in the mapped object
};

const getEmployeeID = () => {
  const token = localStorage.getItem("token");
  if (!token) return "";

  try {
    const decoded = jwtDecode<MyJwtPayload>(token);
    return decoded.personId;
  } catch (error) {
    console.error("Error decoding token:", error);
    return "";
  }
};

const mapApiToReferral = (entry: any, employeeId: string): Referral => ({
  id: String(entry.id),
  jobId: String(entry.jobPosting?.id ?? ""),
  jobTitle: entry.jobPosting?.title ?? "Unknown Job",
  referrerId: String(employeeId),
  referrerName: "", // Can be enhanced if referrer details are available
  candidateName: entry.referred?.name ?? "Unknown",
  candidateEmail: entry.referred?.email ?? "",
  candidatePhone: entry.referred?.phone ?? "",
  status: entry.status?.toLowerCase().replace(/ /g, "_") ?? "submitted",
  submittedAt: new Date(entry.createdAt),
  updatedAt: new Date(entry.updatedAt),
  referralCode: `REF-${entry.id.toString().padStart(3, "0")}`,
  bonusEligible: !!entry.bonus,
  bonusPaid: entry.bonus?.bonusStatus === "SETTLED", // Corrected based on API type
  trackingToken: `token-${entry.id}`,
  createdAt: new Date(entry.createdAt),
  deletedAt: entry.deletedAt ? new Date(entry.deletedAt) : null,
});

const MyReferrals: React.FC = () => {
  const currentUserId = getEmployeeID();
  const { data } = useGetEmployeeReferralsQuery(
    currentUserId ? currentUserId : skipToken
  );
  console.log("🚀 ~ data:", data);

  const referrals: Referral[] = Array.isArray(data)
    ? data.map((entry) => mapApiToReferral(entry, String(currentUserId)))
    : [];

  const myReferrals = referrals.filter(
    (r) => r.referrerId === String(currentUserId)
  );
  console.log("🚀 ~ myReferrals:", myReferrals);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredReferrals = myReferrals.filter(referral => 
    referral.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "referral_submitted":
        return "bg-blue-100 text-blue-800";
      case "referral_under_review":
        return "bg-yellow-100 text-yellow-800";
      case "referral_accepted":
        return "bg-purple-100 text-purple-800";
      case "interview_round_1":
        return "bg-indigo-100 text-indigo-800";
      case "interview_round_2":
        return "bg-pink-100 text-pink-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "referral_submitted":
        return "Your referral has been submitted and is awaiting initial review.";
      case "referral_under_review":
        return "HR is currently reviewing the candidate's application.";
      case "referral_accepted":
        return "The candidate has been scheduled for an interview.";
      case "interview_round_1":
        return "The candidate has cleared the first round and is progressing through the evaluation.";
      case "interview_round_2":
        return "The candidate is now in the second round of interviews.";
      case "accepted":
        return "Congratulations! Your referral has been accepted.";
      case "rejected":
        return "Unfortunately, this referral was not selected at this time.";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">My Referrals</h2>
          <p className="text-gray-600">Track the status of your referrals</p>
        </div>
        <div className="text-sm text-gray-600">
          {filteredReferrals.length} of {myReferrals.length} referrals
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by email or referral code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      {filteredReferrals.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            {myReferrals.length === 0 ? (
              <>
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  You haven't made any referrals yet.
                </p>
                <p className="text-sm text-gray-400">
                  Browse available jobs and start referring your network to earn
                  rewards!
                </p>
              </>
            ) : (
              <>
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  No referrals match your search
                </p>
                <p className="text-sm text-gray-400">
                  Try searching with a different email or referral code
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReferrals.map((referral) => (
            <Card key={referral.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {referral.candidateName}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{referral.jobTitle}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Submitted {format(referral.submittedAt, "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center">
                        <Code className="h-4 w-4 mr-1" />
                        {referral.referralCode}
                      </span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(referral.status)}>
                    {referral.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {getStatusDescription(referral.status)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {referral.candidateEmail}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {referral.candidatePhone}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-gray-600">
                      <strong>Last updated:</strong>{" "}
                      {format(referral.updatedAt, "MMM d, yyyy")}
                    </div>
                    {referral.bonusEligible && (
                      <div className="text-green-600">
                        <strong>Bonus Status:</strong>{" "}
                        {referral.bonusPaid ? "Paid" : "Eligible"}
                      </div>
                    )}
                  </div>
                </div>

                {referral.status === "accepted" && !referral.bonusEligible && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      🎉 <strong>Great news!</strong> Your referral was
                      successful. Bonus eligibility starts 6 months after their
                      start date.
                    </p>
                  </div>
                )}

                {/* referral.notes is not present in the mapped object */}
                {/* {referral.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Your notes:</strong> {referral.notes}
                    </p>
                  </div>
                )} */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReferrals;
