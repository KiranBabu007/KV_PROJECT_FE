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
  department: string;
  salary: string;
  experience: string;
  openPositions: number;
  totalPositions: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'closed';
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

