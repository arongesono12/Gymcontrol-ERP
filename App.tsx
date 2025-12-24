import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Member, Payment, GymEvent, PaymentType, MemberStatus, DashboardStats, UserRole, AppNotification } from './src/types';
import { INITIAL_MEMBERS, INITIAL_PAYMENTS, INITIAL_EVENTS } from './src/constants';

// Layouts & Features
import { MainLayout } from './src/layouts/MainLayout';
import { LoginView } from './src/features/auth/LoginView';
import { RegisterView } from './src/features/auth/RegisterView';
import { DashboardView } from './src/features/dashboard/DashboardView';
import { MembersView } from './src/features/members/MembersView';
import { PaymentsView } from './src/features/payments/PaymentsView';

// --- App Component ---

const AppContent = () => {
  const [currentUser, setCurrentUser] = useState<Member | null>(() => {
    const saved = localStorage.getItem('gym_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isRegistering, setIsRegistering] = useState(false);

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('gym_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });
  
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('gym_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });
  
  const [events] = useState<GymEvent[]>(INITIAL_EVENTS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Logic to generate notifications
  useEffect(() => {
    if (!currentUser) return;
    
    const newNotifications: AppNotification[] = [];
    const today = new Date();
    
    // For members: personal alerts
    if (currentUser.role === UserRole.MEMBER) {
      if (currentUser.nextBillingDate) {
        const nextDate = new Date(currentUser.nextBillingDate);
        const diffTime = nextDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 0) {
          newNotifications.push({
            id: 'n-exp-1',
            title: 'Suscripción Vencida',
            message: 'Tu plan ha expirado. Realiza el pago para seguir entrenando.',
            type: 'error',
            timestamp: 'Ahora',
            read: false
          });
        } else if (diffDays <= 7) {
          newNotifications.push({
            id: 'n-exp-1',
            title: 'Próximo Vencimiento',
            message: `Tu plan vence en ${diffDays} días (${currentUser.nextBillingDate}).`,
            type: 'warning',
            timestamp: 'Hace 5m',
            read: false
          });
        }
      }
    } else {
      // For admins: system alerts
      const expiringSoon = members.filter(m => {
        if (!m.nextBillingDate || m.role === UserRole.ADMIN) return false;
        const diff = new Date(m.nextBillingDate).getTime() - today.getTime();
        return diff > 0 && diff <= (7 * 1000 * 60 * 60 * 24);
      });
      
      if (expiringSoon.length > 0) {
        newNotifications.push({
          id: 'admin-n-1',
          title: 'Alertas de Vencimiento',
          message: `Hay ${expiringSoon.length} miembros con membresía por vencer esta semana.`,
          type: 'warning',
          timestamp: 'Hoy',
          read: false
        });
      }
    }

    setNotifications(newNotifications);
  }, [currentUser, members]);

  useEffect(() => { localStorage.setItem('gym_members', JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem('gym_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { currentUser ? localStorage.setItem('gym_user', JSON.stringify(currentUser)) : localStorage.removeItem('gym_user'); }, [currentUser]);

  const stats: DashboardStats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const monthlyRevenue = payments.filter(p => p.type === PaymentType.MONTHLY).reduce((acc, curr) => acc + curr.amount, 0);
    const dailyRevenue = payments.filter(p => p.date === todayStr).reduce((acc, curr) => acc + curr.amount, 0);
    const mbs = members.filter(m => m.role === UserRole.MEMBER);
    return { totalMembers: mbs.length, activeMembers: mbs.filter(m => m.status === MemberStatus.ACTIVE).length, monthlyRevenue, dailyRevenue, recentPayments: payments.slice(-10).reverse(), pendingPaymentMembers: [], expiringSoonMembers: [] };
  }, [members, payments]);

  const handleUpdateMember = (updated: Member) => {
    setMembers(prev => {
      const exists = prev.find(m => m.id === updated.id);
      return exists ? prev.map(m => m.id === updated.id ? updated : m) : [...prev, updated];
    });
    if (currentUser && currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const handleRegister = (newMember: Member) => {
    setMembers(prev => [...prev, newMember]);
    setCurrentUser(newMember);
    setIsRegistering(false);
  };

  const onDeleteMember = (id: string) => setMembers(prev => prev.filter(m => m.id !== id));
  
  const onAddPayment = (p: Omit<Payment, 'id'>) => {
    const pid = `p-${Date.now()}`;
    setPayments(prev => [...prev, { ...p, id: pid }]);
    if (p.memberId && p.type === PaymentType.MONTHLY) {
      setMembers(prev => prev.map(m => {
        if (m.id === p.memberId) {
          const next = new Date(); next.setMonth(next.getMonth() + 1);
          return { ...m, status: MemberStatus.ACTIVE, lastPaymentDate: p.date, nextBillingDate: next.toISOString().split('T')[0] };
        }
        return m;
      }));
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => setNotifications([]);

  if (!currentUser) {
    if (isRegistering) {
      return <RegisterView onRegister={handleRegister} onBackToLogin={() => setIsRegistering(false)} />;
    }
    return <LoginView onLogin={setCurrentUser} onSwitchToRegister={() => setIsRegistering(true)} />;
  }

  return (
    <MainLayout
      currentUser={currentUser}
      notifications={notifications}
      stats={stats}
      onMarkNotificationAsRead={markAsRead}
      onClearNotifications={clearAllNotifications}
      onUpdateUser={handleUpdateMember}
      onLogout={() => setCurrentUser(null)}
    >
      <Routes>
        <Route path="/" element={<DashboardView stats={stats} />} />
        <Route path="/members" element={<MembersView members={members} onUpdateMember={handleUpdateMember} onDeleteMember={onDeleteMember} onAddPayment={onAddPayment} />} />
        <Route path="/payments" element={<PaymentsView payments={payments} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
