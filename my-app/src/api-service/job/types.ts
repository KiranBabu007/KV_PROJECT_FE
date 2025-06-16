export interface JobPosting {
  id?: number;
  title: string;
  description: string;
  skills: string;
  location: string;
  numOfPositions: number;
  experience: number;
  salary: number;
  bonusForReferral: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJobPostingPayload {
  title: string;
  description: string;
  skills: string;
  location: string;
  numOfPositions: number;
  experience: number;
  salary: number;
  bonusForReferral: number;
}

export interface UpdateJobPostingPayload {
  title?: string;
  description?: string;
  skills?: string;
  location?: string;
  numOfPositions?: number;
  experience?: number;
  salary?: number;
  bonusForReferral?: number;
}

export interface UpdateJobPostingRequest {
  id: number;
  data: UpdateJobPostingPayload;
}

