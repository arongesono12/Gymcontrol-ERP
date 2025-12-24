
export enum PaymentType {
  MONTHLY = 'MONTHLY',
  DAILY = 'DAILY',
}

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
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
  profileImage?: string; // URL o base64 de la imagen
}

export interface Payment {
  id: string;
  memberId: string | null; // null for anonymous daily visitors
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
