export interface User {
  id: string ;
  name: string;
  email: string;
  role: string;
  avatar?: string;
} 

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  salary: string;
  experience: string;
  openPositions: number;
  totalPositions: number;
  createdAt: Date;
  updatedAt: Date;
  status?: 'active' | 'closed';
}


export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'referral' | 'bonus' | 'interview' | 'status_update' | 'job_update';
  read: boolean;
  createdAt: Date;
  relatedId?: string;
}



export interface Referral {
  id: string;
  jobId: string;
  jobTitle: string;
  referrerId: string;
  referrerName: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  resumeUrl?: string;
  status: 'submitted' | 'under_review' | 'interview_scheduled' | 'accepted' | 'declined';
  submittedAt: Date;
  updatedAt: Date;
  referralCode: string;
  bonusEligible: boolean;
  bonusPaid: boolean;
  notes?: string;
  trackingToken?: string

}



export interface Bonus {
  id: string;
  referralId: string;
  referrerId: string;
  amount: number;
  eligibleDate: Date;
  paidDate?: Date;
  status: 'pending' | 'eligible' | 'paid';
}


