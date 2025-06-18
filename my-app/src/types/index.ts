export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface JWTUser {
  email: string;
  employeeId: number;
  exp: number;
  iat: number;
  personId: number;
  personName: string;
  role: "EMPLOYEE" | "ADMIN"; // Add more roles if needed
  avatar?: string;
}

export interface Job {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  description: string;
  skills: string;
  location: string;
  numOfPositions: number;
  remainingPositions: number;
  experience: number;
  salary: number;
  bonusForReferral: number;
}

// export interface Notification {
//   id: string;
//   userId: string;
//   title: string;
//   message: string;
//   type: 'referral' | 'bonus' | 'interview' | 'status_update' | 'job_update';
//   read: boolean;
//   createdAt: Date;
//   relatedId?: string;
// }

export interface Notification {
  id: string;
  title: string;
  content: string;
  status: "READ" | "UNREAD";
  createdAt: Date;
}

export interface APIReferral {
  id: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  jobPosting: {
    id: number;
    title: string;
    bonusForReferral: boolean;
  };
  referrer: {
    id: number;
    name: string;
  };
  referred: {
    name: string;
    email: string;
    phone: string;
  };
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
  status: string;
  submittedAt: string;
  updatedAt: string;
  referralCode: string;
  bonusEligible: boolean;
  bonusPaid: boolean;
  trackingToken: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface Bonus {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  bonusAmount: number;
  bonusStatus: string;
  triggerDate: string;
  referral: Referral;
}

export interface MyJwtPayload {
  personId: number;
  employeeId: number;
  name?: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface APIReferral {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  currentRound: number;
  status: string;
  jobPosting: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    title: string;
    description: string;
    skills: string;
    location: string;
    numOfPositions: number;
    remainingPositions: number;
    experience: number;
    salary: number;
    bonusForReferral: number;
  };
  referrer: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    name: string;
    phone: string;
    email: string;
    role: string;
    employee: {
      id: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: null;
      joiningDate: string;
      password: string;
    };
  };
  referred: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    name: string;
    phone: string;
    email: string;
    role: string;
    candidate: {
      id: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: null;
      yearsOfExperience: number;
    };
  };
  resume: {
    id: number;
  } | null;
}
