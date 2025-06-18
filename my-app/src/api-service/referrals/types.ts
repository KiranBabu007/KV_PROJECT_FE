export interface EmployeeReferralsResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  currentRound: number;
  status: string; // e.g., "Rejected", "Accepted", etc.
  jobPosting: JobPosting;
  referrer: Referrer;
  referred: Referred;
  resume: string | null;
}

export interface JobPosting {
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

export interface Referrer {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  phone: string;
  email: string;
  role: string;
  employee: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    joiningDate: string;
    password: string;
  };
}

export interface Referred {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  phone: string;
  email: string;
  role: string;
  candidate: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    yearsOfExperience: number;
  };
}
