export interface User {
  id: string ;
  name: string;
  email: string;
  role: string;
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
    url: string;
  } | null;
}