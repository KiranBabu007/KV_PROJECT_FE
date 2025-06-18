export interface EmployeeReferralsResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  status: string; // e.g., "Referral Submitted", "Rejected", etc.
  jobPosting: JobPosting;
  referred: Referred;
  resume: string | null;
  bonus: Bonus | null;
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

export interface Referred {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  phone: string;
  email: string;
  role: string; // likely "CANDIDATE"
}

export interface Bonus {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  bonusAmount: number;
  bonusStatus: "PENDING" | "SETTLED"; // add more statuses if needed
  triggerDate: string;
}
