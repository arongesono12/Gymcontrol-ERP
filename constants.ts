
import { Member, MemberStatus, Payment, PaymentType, GymEvent, UserRole } from './types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'admin-1',
    name: 'Admin Principal',
    email: 'admin@gym.com',
    phone: '555-0000',
    registrationDate: '2023-01-01',
    lastPaymentDate: 'N/A',
    status: MemberStatus.ACTIVE,
    plan: 'Admin',
    role: UserRole.ADMIN,
    password: 'admin'
  },
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '555-0101',
    registrationDate: '2023-10-01',
    lastPaymentDate: '2024-05-01',
    status: MemberStatus.ACTIVE,
    plan: 'Premium',
    isRecurring: true,
    nextBillingDate: '2025-06-01',
    role: UserRole.MEMBER,
    password: 'user123'
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@example.com',
    phone: '555-0202',
    registrationDate: '2023-11-15',
    lastPaymentDate: '2024-04-15',
    status: MemberStatus.INACTIVE,
    plan: 'Basic',
    isRecurring: false,
    role: UserRole.MEMBER,
    password: 'user123'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  { id: 'p1', memberId: '1', memberName: 'Juan Pérez', amount: 50000, date: '2024-05-01', type: PaymentType.MONTHLY, isRecurring: true },
  { id: 'p3', memberId: null, memberName: 'Visitante 1', amount: 5000, date: '2024-05-14', type: PaymentType.DAILY },
];

export const INITIAL_EVENTS: GymEvent[] = [
  { id: 'e1', title: 'Crossfit WOD', date: '2024-05-20', time: '08:00', instructor: 'Alex', category: 'High Intensity' },
  { id: 'e2', title: 'Yoga Flow', date: '2024-05-20', time: '10:00', instructor: 'Sarah', category: 'Flexibility' },
];
