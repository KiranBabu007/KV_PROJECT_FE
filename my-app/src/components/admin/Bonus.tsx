
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Calendar, User, CheckCircle, TrendingUp, Clock, Award } from 'lucide-react';
import { format } from 'date-fns';
import type { Bonus, Referral } from '@/types';

// Local mock data
const mockBonuses: Bonus[] = [
  {
    id: '1',
    referralId: '1',
    referrerId: '1',
    amount: 83500, // $1000 converted to INR (approx rate: 83.5)
    eligibleDate: new Date('2024-07-16'),
    status: 'eligible'
  }
];

const mockReferrals: Referral[] = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'Senior Software Engineer',
    referrerId: '1',
    referrerName: 'John Doe',
    candidateName: 'Jane Smith',
    candidateEmail: 'jane.smith@email.com',
    candidatePhone: '+1-555-0123',
    status: 'under_review',
    submittedAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-17'),
    referralCode: 'REF-001',
    bonusEligible: false,
    bonusPaid: false
  }
];

const BonusManagement: React.FC = () => {
  const [bonuses, setBonuses] = useState<Bonus[]>(mockBonuses);
  const [referrals] = useState<Referral[]>(mockReferrals);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'eligible': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'paid': return 'bg-blue-100 text-blue-800 border border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Enhanced bonus data with referrer info
  const enhancedBonuses = bonuses.map(bonus => {
    const referral = referrals.find(r => r.id === bonus.referralId);
    return {
      ...bonus,
      referrerName: referral?.referrerName || 'Unknown',
      candidateName: referral?.candidateName || 'Unknown',
      jobTitle: referral?.jobTitle || 'Unknown Position'
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-teal-500/10"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 bg-clip-text text-transparent">
                      Bonus Management
                    </h1>
                    <p className="text-gray-600 mt-1">Track and manage referral bonuses</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {format(new Date(), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden bg-white/70 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/10 group-hover:from-green-500/10 group-hover:to-emerald-500/20 transition-all duration-300"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Total Bonuses Due</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">₹83,500</p>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>Ready to pay</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white/70 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 group-hover:from-blue-500/10 group-hover:to-indigo-500/20 transition-all duration-300"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Bonuses Paid</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">₹0</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Award className="h-3 w-3 mr-1" />
                    <span>This period</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white/70 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/10 group-hover:from-amber-500/10 group-hover:to-orange-500/20 transition-all duration-300"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Pending Bonuses</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">1</p>
                  <div className="flex items-center text-xs text-amber-600">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Awaiting approval</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Bonus List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Active Bonuses</h2>
            <Badge className="bg-green-100 text-green-800 border border-green-200">
              {enhancedBonuses.length} eligible
            </Badge>
          </div>

          {enhancedBonuses.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur-lg border-white/20 shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No bonuses yet</h3>
                  <p className="text-gray-500">Bonuses will appear here once referrals become eligible.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            enhancedBonuses.map((bonus) => (
              <Card key={bonus.id} className="relative overflow-hidden bg-white/70 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-blue-500/5 group-hover:from-green-500/10 group-hover:to-blue-500/10 transition-all duration-300"></div>
                <CardHeader className="relative pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <CardTitle className="text-xl flex items-center text-gray-900">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                          <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        ₹{bonus.amount.toLocaleString()} Referral Bonus
                      </CardTitle>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 bg-blue-100 rounded-lg">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{bonus.referrerName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>referred</span>
                          <span className="font-medium text-gray-900">{bonus.candidateName}</span>
                        </div>
                        <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                          {bonus.jobTitle}
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(bonus.status)} font-medium px-3 py-1`}>
                      {bonus.status.charAt(0).toUpperCase() + bonus.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative pt-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="p-1.5 bg-green-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-green-600" />
                      </div>
                      <span>Eligible since: <span className="font-medium text-gray-900">{format(bonus.eligibleDate, 'MMM d, yyyy')}</span></span>
                    </div>
                    <div className="flex space-x-3">
                      {bonus.status === 'eligible' && (
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Paid
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white/50 border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Enhanced Bonus Policy */}
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-lg border-white/20 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center text-xl text-gray-900">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg mr-3">
                <Award className="h-5 w-5 text-white" />
              </div>
              Bonus Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Bonuses become eligible 6 months after the referred employee's start date</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Standard bonus amount: ₹83,500 per successful referral</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Bonuses are paid through the regular payroll system</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Admin approval required for all bonus payments</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BonusManagement;