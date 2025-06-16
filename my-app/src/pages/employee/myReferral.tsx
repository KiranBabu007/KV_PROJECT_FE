import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, Code } from 'lucide-react';
import { format } from 'date-fns';
import type { Referral } from '@/types';

// Local mock data
const initialReferrals: Referral[] = [
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
    bonusPaid: false,
    trackingToken: 'sample-token-123'
  },
  {
    id: '2',
    jobId: '2',
    jobTitle: 'Product Manager',
    referrerId: '1',
    referrerName: 'John Doe',
    candidateName: 'Mike Johnson',
    candidateEmail: 'mike.johnson@email.com',
    candidatePhone: '+1-555-0124',
    status: 'accepted',
    submittedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-22'),
    referralCode: 'REF-002',
    bonusEligible: true,
    bonusPaid: false,
    trackingToken: 'sample-token-456'
  }
];

const MyReferrals: React.FC = () => {
  const [referrals] = useState<Referral[]>(initialReferrals);
  const currentUserId = '1'; // Mock current user ID

  const myReferrals = referrals.filter(r => r.referrerId === currentUserId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'interview_scheduled': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'submitted': return 'Your referral has been submitted and is awaiting initial review.';
      case 'under_review': return 'HR is currently reviewing the candidate\'s application.';
      case 'interview_scheduled': return 'The candidate has been scheduled for an interview.';
      case 'accepted': return 'Congratulations! Your referral has been accepted.';
      case 'declined': return 'Unfortunately, this referral was not selected at this time.';
      default: return '';
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
          {myReferrals.length} total referrals
        </div>
      </div>

      {myReferrals.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">You haven't made any referrals yet.</p>
            <p className="text-sm text-gray-400">
              Browse available jobs and start referring your network to earn rewards!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {myReferrals.map((referral) => (
            <Card key={referral.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{referral.candidateName}</CardTitle>
                    <p className="text-sm text-gray-600">{referral.jobTitle}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Submitted {format(referral.submittedAt, 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center">
                        <Code className="h-4 w-4 mr-1" />
                        {referral.referralCode}
                      </span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(referral.status)}>
                    {referral.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">{getStatusDescription(referral.status)}</p>
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
                      <strong>Last updated:</strong> {format(referral.updatedAt, 'MMM d, yyyy')}
                    </div>
                    {referral.bonusEligible && (
                      <div className="text-green-600">
                        <strong>Bonus Status:</strong> {referral.bonusPaid ? 'Paid' : 'Eligible'}
                      </div>
                    )}
                  </div>
                </div>

                {referral.status === 'accepted' && !referral.bonusEligible && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      🎉 <strong>Great news!</strong> Your referral was successful. 
                      Bonus eligibility starts 6 months after their start date.
                    </p>
                  </div>
                )}

                {referral.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Your notes:</strong> {referral.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReferrals;