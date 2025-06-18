import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, Calendar, User, Mail, Phone, FileText, Clock, Award, Users } from 'lucide-react';
import { format } from 'date-fns';
import type { Referral } from '@/types';
import { 
  useGetReferralsListQuery,
  useUpdateReferralStatusMutation 
} from '@/api-service/referrals/referrals.api';

const ReferralManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReferral, setSelectedReferral] = useState<string | null>(null);

const enum ReferralStatus {
    REFERRAL_SUBMITTED = "Referral Submitted",
    REFERRAL_UNDER_REVIEW = "Referral Under Review",
    REFERRAL_ACCEPTED = "Referral Accepted",
    INTERVIEW_ROUND_1 = "Interviews Round 1",
    INTERVIEWS_ROUND_2 = "Interview Round 2",
    ACCEPTED = "Accepted",
    REJECTED = "Rejected"
}
  
  // Replace api.referrals with RTK Query hooks
  const { data: referralsData = [], isLoading } = useGetReferralsListQuery();
  const [updateStatus] = useUpdateReferralStatusMutation();

  // Map API data to component format
  const referrals = useMemo(() => 
    referralsData.map((ref): Referral => ({
      id: String(ref.id),
      jobId: String(ref.jobPosting.id),
      jobTitle: ref.jobPosting.title,
      referrerId: String(ref.referrer.id),
      referrerName: ref.referrer.name,
      candidateName: ref.referred.name,
      candidateEmail: ref.referred.email,
      candidatePhone: ref.referred.phone,
      status: ref.status.toLowerCase().replace(/ /g, '_'),
      submittedAt: new Date(ref.createdAt),
      updatedAt: new Date(ref.updatedAt),
      referralCode: `REF-${ref.id.toString().padStart(3, '0')}`,
      bonusEligible: ref.currentRound >= 1,
      bonusPaid: false,  // You might want to check this from bonus data
      yearsOfExperience: ref.referred.candidate?.yearsOfExperience || 0,
      skills: ref.jobPosting.skills,
      location: ref.jobPosting.location,
    })), [referralsData]
  );

  // Update the status update handler to use API
  const handleStatusUpdate = async (referralId: string, newStatus: string) => {
    try {
      await updateStatus({
        id: parseInt(referralId),
        status: newStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      }).unwrap();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

 const getStatusColor = (status: string) => {
  switch (status) {
    case ReferralStatus.REFERRAL_SUBMITTED: 
      return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200';
    case ReferralStatus.REFERRAL_UNDER_REVIEW: 
      return 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200';
    case ReferralStatus.INTERVIEW_ROUND_1:
    case ReferralStatus.INTERVIEWS_ROUND_2:
      return 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border-purple-200';
    case ReferralStatus.ACCEPTED:
      return 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-200';
    case ReferralStatus.REJECTED:
      return 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-200';
  }
};

  const getStatusIcon = (status: string) => {
  switch (status) {
    case ReferralStatus.REFERRAL_SUBMITTED:
      return <Clock className="h-3 w-3" />;
    case ReferralStatus.REFERRAL_UNDER_REVIEW:
      return <Search className="h-3 w-3" />;
    case ReferralStatus.INTERVIEW_ROUND_1:
    case ReferralStatus.INTERVIEWS_ROUND_2:
      return <Calendar className="h-3 w-3" />;
    case ReferralStatus.ACCEPTED:
      return <Award className="h-3 w-3" />;
    case ReferralStatus.REJECTED:
      return <User className="h-3 w-3" />;
    default:
      return <Clock className="h-3 w-3" />;
  }
};

  const searchReferrals = (query: string): Referral[] => {
    const lowercaseQuery = query.toLowerCase();
    return referrals.filter(referral =>
      referral.candidateEmail.toLowerCase().includes(lowercaseQuery) ||
      referral.referralCode.toLowerCase().includes(lowercaseQuery) ||
      referral.candidateName.toLowerCase().includes(lowercaseQuery)
    );
  };

  const updateReferral = (id: string, updates: Partial<Referral>) => {
    setReferrals(prev => prev.map(referral => 
      referral.id === id ? { ...referral, ...updates, updatedAt: new Date() } : referral
    ));
  };

  const displayReferrals = searchQuery ? searchReferrals(searchQuery) : referrals;

  const getStatsCards = () => {
    const stats = {
      total: referrals.length,
      submitted: referrals.filter(r => r.status === 'submitted').length,
      under_review: referrals.filter(r => r.status === 'under_review').length,
      accepted: referrals.filter(r => r.status === 'accepted').length,
    };
    return stats;
  };

  const stats = getStatsCards();

  return (
    <div className="space-y-8 animate-fade-in">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Enhanced Header with Stats */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  Referral Management
                </h2>
                <p className="text-gray-600 mt-1">Manage and track employee referrals</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by email, name, or referral code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80 bg-white/80 backdrop-blur-sm border-gray-200 focus:bg-white focus:shadow-md transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total Referrals</p>
                      <p className="text-3xl font-bold text-blue-800">{stats.total}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 text-sm font-medium">Under Review</p>
                      <p className="text-3xl font-bold text-yellow-800">{stats.under_review}</p>
                    </div>
                    <Search className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">New Submissions</p>
                      <p className="text-3xl font-bold text-purple-800">{stats.submitted}</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Accepted</p>
                      <p className="text-3xl font-bold text-green-800">{stats.accepted}</p>
                    </div>
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Referrals List */}
            <div className="lg:col-span-2 space-y-4">
              {displayReferrals.length === 0 ? (
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">
                      {searchQuery ? 'No referrals found matching your search.' : 'No referrals yet.'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Referrals will appear here once employees start submitting candidates.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                displayReferrals.map((referral) => (
                  <Card 
                    key={referral.id} 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm ${
                      selectedReferral === referral.id ? 'ring-2 ring-blue-500 shadow-xl scale-[1.02]' : 'hover:scale-[1.01]'
                    }`}
                    onClick={() => setSelectedReferral(referral.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <CardTitle className="text-xl bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                            {referral.candidateName}
                          </CardTitle>
                          <p className="text-gray-700 font-medium">{referral.jobTitle}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            Referred by {referral.referrerName} • Code: 
                            <span className="font-mono ml-1 bg-gray-100 px-2 py-1 rounded text-xs">
                              {referral.referralCode}
                            </span>
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(referral.status)} border px-3 py-1 flex items-center gap-1`}>
                          {getStatusIcon(referral.status)}
                          {referral.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-6">
                          <span className="flex items-center bg-white px-2 py-1 rounded">
                            <Mail className="h-4 w-4 mr-2 text-blue-600" />
                            {referral.candidateEmail}
                          </span>
                          <span className="flex items-center bg-white px-2 py-1 rounded">
                            <Phone className="h-4 w-4 mr-2 text-green-600" />
                            {referral.candidatePhone}
                          </span>
                        </div>
                        <span className="flex items-center bg-white px-2 py-1 rounded">
                          <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                          {format(referral.submittedAt, 'MMM d, yyyy')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Enhanced Referral Details Panel */}
            <div className="space-y-6">
              {selectedReferral ? (
                (() => {
                  const referral = referrals.find(r => r.id === selectedReferral);
                  if (!referral) return null;

                  return (
                    <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white via-gray-50 to-blue-50">
                      <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl text-white font-bold">
                                {referral.candidateName}
                              </CardTitle>
                              <p className="text-blue-100 font-medium">{referral.jobTitle}</p>
                              <p className="text-blue-200 text-sm flex items-center mt-1">
                                <span className="font-mono bg-white/20 px-2 py-1 rounded text-xs mr-2">
                                  {referral.referralCode}
                                </span>
                                • Referred by {referral.referrerName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-6 space-y-6">
                        {/* Status Update Section */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-gray-800 flex items-center">
                              <Award className="h-4 w-4 mr-2 text-blue-600" />
                              Status Management
                            </label>
                            <Badge className={`${getStatusColor(referral.status)} border px-3 py-1.5 flex items-center gap-1 font-medium`}>
                              {getStatusIcon(referral.status)}
                              {referral.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <Select 
  value={referral.status} 
  onValueChange={(value) => handleStatusUpdate(referral.id, value)}
>
 <SelectTrigger 
  className="w-full bg-white border-2 border-gray-200 hover:border-blue-300 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 flex items-center justify-between py-2 px-3 rounded-lg"
>
  <div className="flex items-center space-x-2">
    {getStatusIcon(referral.status)}Update the Status
    <SelectValue placeholder="Select a new status" className="text-gray-700 font-medium" />
  </div>
</SelectTrigger>
  <SelectContent className="bg-white border-gray-200 shadow-2xl rounded-lg">
    <SelectItem value={ReferralStatus.REFERRAL_SUBMITTED} className="hover:bg-blue-50 cursor-pointer">
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-blue-600" />
        <span>📋 {ReferralStatus.REFERRAL_SUBMITTED}</span>
      </div>
    </SelectItem>
    <SelectItem value={ReferralStatus.REFERRAL_UNDER_REVIEW} className="hover:bg-yellow-50 cursor-pointer">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-yellow-600" />
        <span>🔍 {ReferralStatus.REFERRAL_UNDER_REVIEW}</span>
      </div>
    </SelectItem>
    <SelectItem value={ReferralStatus.REFERRAL_ACCEPTED} className="hover:bg-green-50 cursor-pointer">
      <div className="flex items-center space-x-2">
        <Award className="h-4 w-4 text-green-600" />
        <span>✅ {ReferralStatus.REFERRAL_ACCEPTED}</span>
      </div>
    </SelectItem>
    <SelectItem value={ReferralStatus.INTERVIEW_ROUND_1} className="hover:bg-purple-50 cursor-pointer">
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-purple-600" />
        <span>📅 {ReferralStatus.INTERVIEW_ROUND_1}</span>
      </div>
    </SelectItem>
    <SelectItem value={ReferralStatus.INTERVIEWS_ROUND_2} className="hover:bg-indigo-50 cursor-pointer">
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-indigo-600" />
        <span>📅 {ReferralStatus.INTERVIEWS_ROUND_2}</span>
      </div>
    </SelectItem>
    <SelectItem value={ReferralStatus.ACCEPTED} className="hover:bg-green-50 cursor-pointer">
      <div className="flex items-center space-x-2">
        <Award className="h-4 w-4 text-green-600" />
        <span>✅ {ReferralStatus.ACCEPTED}</span>
      </div>
    </SelectItem>
    <SelectItem value={ReferralStatus.REJECTED} className="hover:bg-red-50 cursor-pointer">
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-red-600" />
        <span>❌ {ReferralStatus.REJECTED}</span>
      </div>
    </SelectItem>
</SelectContent>
</Select>
                        </div>

                        {/* Information Cards Grid */}
                        <div className="grid grid-cols-1 gap-4">
                          {/* Candidate Information */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-center mb-4">
                              <div className="p-2 bg-blue-500 rounded-lg mr-3">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <h3 className="font-bold text-gray-800">Candidate Details</h3>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                                <span className="text-gray-600 font-medium">Name</span>
                                <span className="font-semibold text-gray-800">{referral.candidateName}</span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                                <span className="text-gray-600 font-medium flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  Email
                                </span>
                                <span className="font-semibold text-blue-600">{referral.candidateEmail}</span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                                <span className="text-gray-600 font-medium flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  Phone
                                </span>
                                <span className="font-semibold text-gray-800">{referral.candidatePhone}</span>
                              </div>
                            </div>
                          </div>

                          {/* Referrer & Position Information */}
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-center mb-4">
                              <div className="p-2 bg-purple-500 rounded-lg mr-3">
                                <Users className="h-4 w-4 text-white" />
                              </div>
                              <h3 className="font-bold text-gray-800">Position & Referrer</h3>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                                <span className="text-gray-600 font-medium">Position</span>
                                <span className="font-semibold text-gray-800">{referral.jobTitle}</span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                                <span className="text-gray-600 font-medium">Referrer</span>
                                <span className="font-semibold text-purple-600">{referral.referrerName}</span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                                <span className="text-gray-600 font-medium">Code</span>
                                <span className="font-mono bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                                  {referral.referralCode}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Timeline Information */}
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-center mb-4">
                              <div className="p-2 bg-green-500 rounded-lg mr-3">
                                <Calendar className="h-4 w-4 text-white" />
                              </div>
                              <h3 className="font-bold text-gray-800">Timeline</h3>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                                <span className="text-gray-600 font-medium">Submitted</span>
                                <span className="font-semibold text-green-600">
                                  {format(referral.submittedAt, 'PPP')}
                                </span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                                <span className="text-gray-600 font-medium">Last Updated</span>
                                <span className="font-semibold text-gray-800">
                                  {format(referral.updatedAt, 'PPP')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {referral.resumeUrl && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 font-medium"
                          >
                            <FileText className="h-4 w-4 mr-2 text-blue-600" />
                            View Resume
                          </Button>
                        )}

                       
                      </CardContent>
                    </Card>
                  );
                })()
              ) : (
                <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <div className="animate-bounce mb-4">
                      <Search className="h-16 w-16 text-gray-400 mx-auto" />
                    </div>
                    <p className="text-gray-600 text-lg font-medium mb-2">Select a referral to manage</p>
                    <p className="text-gray-500 text-sm">
                      Click on any referral from the list to view and update its details.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReferralManagement;