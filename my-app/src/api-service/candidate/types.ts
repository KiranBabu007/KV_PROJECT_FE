export interface ReferralStatusHistory {
  id: number;
  status: string; // or `ReferralStatus` if you have an enum defined
  createdAt: string; // ISO date string
  updatedAt: string;
  deletedAt: string;
}

export interface ReferralsResponse {
  id: number;
  candidateName: string;
  position: string;
  referredBy: string;
  submittedDate: string; // ISO date string
  currentStatus: string;
  histories: ReferralStatusHistory[];
  failedAt: string;
}

export interface NotificationsResponse {
  id: string;
  title: string;
  content: string;
  created_at: string; // ISO string
  status: string;
}

export interface ReadResponse {}

export interface ReadPayload {
  id: number;
}
