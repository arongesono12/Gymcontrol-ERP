
import { Member, MemberStatus, Payment, PaymentType, GymEvent } from './types';

export const INITIAL_MEMBERS: Member[] = [
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
    nextBillingDate: '2024-06-01'
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
    isRecurring: false
  },
  {
    id: '3',
    name: 'Carlos López',
    email: 'carlos@example.com',
    phone: '555-0303',
    registrationDate: '2024-01-20',
    lastPaymentDate: '2024-05-10',
    status: MemberStatus.ACTIVE,
    plan: 'Standard',
    isRecurring: false
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  { id: 'p1', memberId: '1', memberName: 'Juan Pérez', amount: 50, date: '2024-05-01', type: PaymentType.MONTHLY, isRecurring: true },
  { id: 'p2', memberId: '3', memberName: 'Carlos López', amount: 35, date: '2024-05-10', type: PaymentType.MONTHLY, isRecurring: false },
  { id: 'p3', memberId: null, memberName: 'Visitante 1', amount: 10, date: '2024-05-14', type: PaymentType.DAILY },
  { id: 'p4', memberId: null, memberName: 'Visitante 2', amount: 10, date: '2024-05-14', type: PaymentType.DAILY },
];

export const INITIAL_EVENTS: GymEvent[] = [
  { id: 'e1', title: 'Crossfit WOD', date: '2024-05-20', time: '08:00', instructor: 'Alex', category: 'High Intensity' },
  { id: 'e2', title: 'Yoga Flow', date: '2024-05-20', time: '10:00', instructor: 'Sarah', category: 'Flexibility' },
  { id: 'e3', title: 'Zumba Party', date: '2024-05-21', time: '18:00', instructor: 'Mike', category: 'Cardio' },
];
