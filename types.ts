
export enum PaymentType {
  MONTHLY = 'MONTHLY',
  DAILY = 'DAILY',
}

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  lastPaymentDate: string;
  status: MemberStatus;
  plan: string;
  isRecurring?: boolean;
  nextBillingDate?: string;
  profileImage?: string; 
  role: UserRole;
  password?: string;
}

export interface Payment {
  id: string;
  memberId: string | null;
  memberName: string;
  amount: number;
  date: string;
  type: PaymentType;
  isRecurring?: boolean;
}

export interface GymEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  instructor: string;
  category: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  monthlyRevenue: number;
  dailyRevenue: number;
  recentPayments: Payment[];
  pendingPaymentMembers: Member[];
  expiringSoonMembers: Member[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'error' | 'success';
  timestamp: string;
  read: boolean;
}
