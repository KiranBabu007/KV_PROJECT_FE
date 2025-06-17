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
  bonusForRefferal:number

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
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  currentRound: number;
  status: string;
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


