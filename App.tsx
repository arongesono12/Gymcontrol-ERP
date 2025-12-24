
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Plus, 
  Search, 
  TrendingUp, 
  MessageSquare,
  Menu,
  X,
  Phone,
  Mail,
  CalendarDays,
  Activity,
  User as UserIcon,
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  Edit2, 
  DollarSign, 
  ArrowUpRight, 
  ShieldCheck, 
  Camera, 
  Upload, 
  AlertTriangle, 
  Bell, 
  ExternalLink, 
  BellOff,
  Share2,
  Download,
  LogOut,
  Lock,
  UserPlus,
  ShieldAlert,
  History
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

import { Member, Payment, GymEvent, PaymentType, MemberStatus, DashboardStats, UserRole } from './types';
import { INITIAL_MEMBERS, INITIAL_PAYMENTS, INITIAL_EVENTS } from './constants';
import { getGymInsights } from './services/geminiService';

// --- Auth Views ---

const LoginView = ({ onLogin, onSwitchToRegister }: { onLogin: (user: Member) => void, onSwitchToRegister: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const members = JSON.parse(localStorage.getItem('gym_members') || JSON.stringify(INITIAL_MEMBERS));
    const user = members.find((m: Member) => m.email === email && m.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Credenciales inválidas. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl shadow-xl shadow-emerald-500/20 mb-6">
            <TrendingUp size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">GymControl</h1>
          <p className="text-slate-500 mt-2 font-medium">Acceso seguro al sistema ERP.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-10 rounded-[2.5rem] shadow-2xl space-y-6">
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold text-center">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
              <input 
                type="email" 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-6 text-white font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="usuario@gym.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
              <input 
                type="password" 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-6 text-white font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest">
            Entrar
          </button>

          <p className="text-center text-slate-500 text-xs font-bold pt-4">
            ¿Eres nuevo? <button type="button" onClick={onSwitchToRegister} className="text-emerald-400 hover:underline">Crea tu cuenta aquí</button>
          </p>
        </form>
      </div>
    </div>
  );
};

const RegisterView = ({ onRegister, onSwitchToLogin }: { onRegister: (user: Member) => void, onSwitchToLogin: () => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: Member = {
      id: `u-${Date.now()}`,
      ...formData,
      registrationDate: new Date().toISOString().split('T')[0],
      lastPaymentDate: 'Sin pagos',
      status: MemberStatus.PENDING,
      plan: 'Basic',
      role: UserRole.MEMBER
    };
    onRegister(newUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[150px]" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight">Registro de Miembro</h2>
          <p className="text-slate-500 mt-2">Únete a nuestra comunidad fitness.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-10 rounded-[2.5rem] shadow-2xl space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre</label>
            <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-3 px-4 text-white font-bold focus:ring-2 focus:ring-emerald-500 outline-none" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <input type="email" className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-3 px-4 text-white font-bold focus:ring-2 focus:ring-emerald-500 outline-none" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Contraseña</label>
            <input type="password" className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-3 px-4 text-white font-bold focus:ring-2 focus:ring-emerald-500 outline-none" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Teléfono</label>
            <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-3 px-4 text-white font-bold focus:ring-2 focus:ring-emerald-500 outline-none" onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
          </div>

          <button type="submit" className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-emerald-400 transition-all uppercase tracking-widest text-xs mt-4">
            Finalizar Registro
          </button>

          <p className="text-center text-slate-500 text-xs font-bold pt-4">
            ¿Ya tienes cuenta? <button type="button" onClick={onSwitchToLogin} className="text-emerald-400 hover:underline">Entra aquí</button>
          </p>
        </form>
      </div>
    </div>
  );
};

// --- Member Dashboard View ---

const MemberDashboardView = ({ user, payments }: { user: Member, payments: Payment[] }) => {
  const userPayments = useMemo(() => payments.filter(p => p.memberId === user.id), [payments, user]);
  
  const daysLeft = useMemo(() => {
    if (!user.nextBillingDate) return 0;
    const diff = new Date(user.nextBillingDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [user.nextBillingDate]);

  const isExpiringSoon = daysLeft > 0 && daysLeft <= 7;
  const isExpired = daysLeft === 0 && user.nextBillingDate;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Panel de Atleta: {user.name}</h2>
          <p className="text-slate-500 font-medium">Visualiza tu progreso y estado de cuenta.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-800/50 backdrop-blur-md p-4 rounded-3xl border border-slate-700/50">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nivel del Plan</p>
              <p className="text-cyan-400 font-black">{user.plan}</p>
           </div>
           <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
             <Activity size={20} />
           </div>
        </div>
      </div>

      {(isExpiringSoon || isExpired) && (
        <div className={`p-8 rounded-[2.5rem] border flex flex-col md:flex-row items-center gap-6 shadow-2xl animate-in zoom-in ${isExpired ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
           <div className={`p-5 rounded-3xl ${isExpired ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
              <ShieldAlert size={40} className={isExpiringSoon ? 'animate-pulse' : ''} />
           </div>
           <div className="flex-1 text-center md:text-left">
             <h3 className={`font-black text-2xl ${isExpired ? 'text-red-400' : 'text-amber-400'}`}>
               {isExpired ? '¡ACCESO RESTRINGIDO!' : '¡ATENCIÓN: PRÓXIMO VENCIMIENTO!'}
             </h3>
             <p className="text-slate-400 font-medium mt-1">
               {isExpired ? 'Tu cuota ha vencido. Por favor, acércate a recepción o realiza el pago online.' : `Tu acceso vence en ${daysLeft} días. Mantén tu ritmo y renueva pronto.`}
             </p>
           </div>
           <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-10 py-4 rounded-2xl shadow-xl transition-all uppercase text-xs tracking-widest active:scale-95">
             Renovar Ahora
           </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-800/50 border border-slate-700/50 p-10 rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center text-center">
          <p className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-4">Días de Entrenamiento Disponibles</p>
          <div className={`text-8xl font-black transition-colors ${daysLeft <= 3 ? 'text-red-500' : 'text-emerald-400'}`}>
            {daysLeft}
          </div>
          <div className="mt-8 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30 w-full">
            <p className="text-xs font-bold text-slate-400 flex justify-between"><span>Vence el:</span> <span className="text-white">{user.nextBillingDate || 'No disponible'}</span></p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 p-8 rounded-[2.5rem] shadow-xl">
           <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-black text-white flex items-center gap-3">
               <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400"><History size={20} /></div>
               Mi Recorrido de Pagos
             </h3>
           </div>
           <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {userPayments.length > 0 ? (
                userPayments.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-5 bg-slate-900/40 rounded-3xl border border-slate-700/30 group">
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-slate-800 rounded-2xl text-slate-400 group-hover:text-emerald-400 transition-colors">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="font-black text-white">{p.type === PaymentType.MONTHLY ? 'Cuota de Membresía' : 'Ticket de Acceso'}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{p.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-emerald-400">{p.amount.toLocaleString()} XAF</p>
                       <p className="text-[9px] font-black text-emerald-500/50 uppercase">Procesado</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <div className="p-4 bg-slate-900 rounded-full text-slate-700"><Clock size={40} /></div>
                  <p className="text-slate-500 font-bold italic">No se encontraron registros de pago.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Shared Components ---

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-emerald-500/10 group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-white tracking-tight">{value}</h3>
      </div>
      <div className={`p-4 rounded-2xl ${color} shadow-lg transition-transform group-hover:rotate-6`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
      <ArrowUpRight size={12} />
      <span>+12% este mes</span>
    </div>
  </div>
);

const Sidebar = ({ isOpen, toggle, role }: { isOpen: boolean, toggle: () => void, role: UserRole }) => {
  const location = useLocation();
  const navItems = role === UserRole.ADMIN ? [
    { path: '/', label: 'Panel Control', icon: LayoutDashboard },
    { path: '/members', label: 'Miembros', icon: Users },
    { path: '/payments', label: 'Pagos/Finanzas', icon: CreditCard },
    { path: '/calendar', label: 'Calendario', icon: CalendarIcon },
  ] : [
    { path: '/', label: 'Mi Actividad', icon: Activity },
    { path: '/calendar', label: 'Horarios', icon: CalendarIcon },
    { path: '/payments', label: 'Mis Pagos', icon: History },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={toggle} />}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800/50 z-50 transform transition-transform duration-500 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20">
              <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white leading-none">GymControl</h1>
              <p className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase mt-1">{role === UserRole.ADMIN ? 'Admin ERP' : 'Atleta App'}</p>
            </div>
          </div>
          <nav className="space-y-3 flex-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => window.innerWidth < 1024 && toggle()} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'} />
                  <span className="text-sm font-bold">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

// --- Reusable Payment Registration Modal ---

const PaymentRegistrationModal = ({ 
  isOpen, 
  onClose, 
  members, 
  onAddPayment, 
  initialMemberId 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  members: Member[], 
  onAddPayment: (p: Omit<Payment, 'id'>) => void,
  initialMemberId?: string
}) => {
  const [formData, setFormData] = useState({ 
    memberId: initialMemberId || '', 
    amount: 0, 
    type: PaymentType.MONTHLY, 
    date: new Date().toISOString().split('T')[0] 
  });

  useEffect(() => {
    if (initialMemberId) setFormData(prev => ({ ...prev, memberId: initialMemberId }));
  }, [initialMemberId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find(m => m.id === formData.memberId);
    if (!member && formData.type === PaymentType.MONTHLY) return;

    onAddPayment({
      memberId: formData.memberId,
      memberName: member?.name || 'Desconocido',
      amount: formData.amount,
      date: formData.date,
      type: formData.type,
      isRecurring: true // Por defecto
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[90] flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700/50 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-black text-white tracking-tight">Registrar Cobro</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-all"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Atleta</label>
            <select 
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white font-bold" 
              value={formData.memberId} 
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })} 
              required
            >
              <option value="">Seleccionar atleta...</option>
              {members.filter(m => m.role === UserRole.MEMBER).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipo de Pago</label>
              <select 
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white font-bold" 
                value={formData.type} 
                onChange={(e) => setFormData({ ...formData, type: e.target.value as PaymentType })}
              >
                <option value={PaymentType.MONTHLY}>Mensual</option>
                <option value={PaymentType.DAILY}>Diario</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha</label>
              <input 
                type="date" 
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white font-bold" 
                value={formData.date} 
                onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Monto (XAF)</label>
            <input 
              type="number" 
              className="w-full bg-slate-900 border border-slate-700 rounded-3xl py-5 px-6 text-white text-2xl font-black focus:ring-2 focus:ring-emerald-500 outline-none" 
              value={formData.amount} 
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} 
              required 
              placeholder="0" 
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black py-5 rounded-3xl shadow-2xl active:scale-95 text-sm uppercase transition-all mt-4">
            Validar y Guardar Pago
          </button>
        </form>
      </div>
    </div>
  );
};

// --- View Components ---

const DashboardView = ({ stats }: { stats: DashboardStats }) => {
  const weeklyData = [{ name: 'Lun', ingresos: 12000 }, { name: 'Mar', ingresos: 21000 }, { name: 'Mie', ingresos: 18000 }, { name: 'Jue', ingresos: 30000 }, { name: 'Vie', ingresos: 45000 }, { name: 'Sab', ingresos: 32000 }, { name: 'Dom', ingresos: 15000 }];
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Atletas Totales" value={stats.totalMembers} icon={Users} color="bg-gradient-to-br from-blue-500 to-indigo-600" />
        <StatCard title="En Sala" value={stats.activeMembers} icon={Activity} color="bg-gradient-to-br from-emerald-500 to-teal-600" />
        <StatCard title="Recaudación Mes" value={`${stats.monthlyRevenue.toLocaleString()} XAF`} icon={CreditCard} color="bg-gradient-to-br from-purple-500 to-fuchsia-600" />
        <StatCard title="Caja Hoy" value={`${stats.dailyRevenue.toLocaleString()} XAF`} icon={DollarSign} color="bg-gradient-to-br from-orange-500 to-amber-600" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-[2.5rem] shadow-2xl">
          <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3"><TrendingUp size={20} className="text-emerald-400" /> Ingresos Semanales</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} /><XAxis dataKey="name" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} /><Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={4} dot={{ fill: '#10b981', r: 6 }} /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
           <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3"><Clock size={20} className="text-purple-400" /> Cobros de Hoy</h3>
           <div className="space-y-4">
              {stats.recentPayments.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-slate-900/40 rounded-2xl border border-slate-700/30">
                  <div><p className="font-bold text-white text-sm">{p.memberName}</p><p className="text-[9px] uppercase text-slate-500">{p.type}</p></div>
                  <p className="font-black text-emerald-400 text-sm">{p.amount.toLocaleString()} XAF</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

const MembersView = ({ 
  members, 
  onUpdateMember, 
  onAddPayment 
}: { 
  members: Member[], 
  onUpdateMember: (m: Member) => void,
  onAddPayment: (p: Omit<Payment, 'id'>) => void
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberForPayment, setMemberForPayment] = useState<Member | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) && m.role === UserRole.MEMBER);

  const handleTriggerUpload = (id: string) => { setActiveUploadId(id); fileInputRef.current?.click(); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const member = members.find(m => m.id === activeUploadId);
        if (member) onUpdateMember({ ...member, profileImage: reader.result as string });
        setActiveUploadId(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Directorio de Miembros</h2>
          <p className="text-slate-500 font-medium">Control y seguimiento de deportistas registrados.</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input type="text" placeholder="Buscar atleta..." className="bg-slate-800/80 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none w-full md:w-80 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredMembers.map((m) => (
          <div key={m.id} className="bg-slate-800/40 border border-slate-700/50 rounded-[2.5rem] p-8 shadow-xl hover:shadow-emerald-500/10 transition-all group overflow-hidden relative flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="relative group/photo">
                <div className="w-20 h-20 rounded-3xl bg-slate-900 border-2 border-slate-700/50 flex items-center justify-center text-emerald-400 overflow-hidden shadow-2xl group-hover:border-emerald-500 transition-all">
                  {m.profileImage ? <img src={m.profileImage} className="w-full h-full object-cover" /> : <UserIcon size={32} />}
                </div>
                <button onClick={() => handleTriggerUpload(m.id)} className="absolute -bottom-1 -right-1 p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 shadow-lg opacity-0 group-hover/photo:opacity-100 transition-opacity"><Camera size={14} /></button>
              </div>
              <span className={`px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase border ${m.status === MemberStatus.ACTIVE ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{m.status}</span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors truncate">{m.name}</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{m.plan} • {m.email}</p>
            </div>

            <div className="space-y-2 mb-8 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
               <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                  <Phone size={14} className="text-slate-600" />
                  <span>{m.phone}</span>
               </div>
               <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                  <CalendarDays size={14} className="text-slate-600" />
                  <span>Reg: {m.registrationDate}</span>
               </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-700/30 flex flex-col gap-3">
              <div className="flex gap-2">
                <button 
                  onClick={() => setMemberForPayment(m)}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white font-black py-3 rounded-2xl transition-all text-[10px] uppercase shadow-lg shadow-emerald-500/5"
                >
                  <CreditCard size={14} /> Registrar Pago
                </button>
                <button 
                  onClick={() => setSelectedMember(m)}
                  className="p-3 bg-slate-700/30 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all"
                  title="Ver Perfil"
                >
                  <UserIcon size={16} />
                </button>
              </div>
              <button 
                onClick={() => handleTriggerUpload(m.id)}
                className="w-full flex items-center justify-center gap-2 bg-slate-700/20 hover:bg-slate-700/40 text-slate-500 hover:text-white font-black py-3 rounded-2xl transition-all text-[10px] uppercase border border-slate-700/30"
              >
                <Upload size={14} /> Actualizar Foto
              </button>
            </div>
          </div>
        ))}
      </div>

      <PaymentRegistrationModal 
        isOpen={!!memberForPayment} 
        onClose={() => setMemberForPayment(null)} 
        members={members} 
        onAddPayment={onAddPayment}
        initialMemberId={memberForPayment?.id}
      />

      {selectedMember && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-800 border border-slate-700/50 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="relative h-24 bg-gradient-to-r from-emerald-500 to-cyan-500" />
            <div className="px-10 pb-10 -mt-12 relative">
              <div className="w-24 h-24 rounded-3xl bg-slate-900 border-4 border-slate-800 flex items-center justify-center text-emerald-400 shadow-2xl overflow-hidden mb-8">
                {selectedMember.profileImage ? <img src={selectedMember.profileImage} className="w-full h-full object-cover" /> : <UserIcon size={40} />}
              </div>
              <h3 className="text-3xl font-black text-white mb-2">{selectedMember.name}</h3>
              <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-8">Plan: {selectedMember.plan}</p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                 <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Email</p>
                   <p className="text-white font-bold truncate">{selectedMember.email}</p>
                 </div>
                 <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Teléfono</p>
                   <p className="text-white font-bold">{selectedMember.phone}</p>
                 </div>
                 <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Fecha Registro</p>
                   <p className="text-white font-bold">{selectedMember.registrationDate}</p>
                 </div>
                 <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Último Pago</p>
                   <p className="text-white font-bold">{selectedMember.lastPaymentDate}</p>
                 </div>
              </div>
              <button onClick={() => setSelectedMember(null)} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-black py-4 rounded-2xl transition-all">Cerrar Ficha</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- App Navigation Wrapper ---

const AppContent = () => {
  const [currentUser, setCurrentUser] = useState<Member | null>(() => {
    const saved = localStorage.getItem('gym_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('gym_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('gym_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });
  const [events] = useState<GymEvent[]>(INITIAL_EVENTS);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { localStorage.setItem('gym_members', JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem('gym_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { 
    if (currentUser) {
      localStorage.setItem('gym_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gym_user');
    }
  }, [currentUser]);

  const stats: DashboardStats = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const monthlyRevenue = payments.filter(p => p.type === PaymentType.MONTHLY).reduce((acc, curr) => acc + curr.amount, 0);
    const dailyRevenue = payments.filter(p => p.type === PaymentType.DAILY && p.date === todayStr).reduce((acc, curr) => acc + curr.amount, 0);
    const pendingPaymentMembers = members.filter(m => m.nextBillingDate && m.status === MemberStatus.ACTIVE && new Date(m.nextBillingDate) < today);
    const expiringSoonMembers = members.filter(m => {
      if (!m.nextBillingDate) return false;
      const diffDays = Math.ceil((new Date(m.nextBillingDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return m.status === MemberStatus.ACTIVE && diffDays >= 0 && diffDays <= 7;
    });
    return { totalMembers: members.filter(m => m.role === UserRole.MEMBER).length, activeMembers: members.filter(m => m.status === MemberStatus.ACTIVE && m.role === UserRole.MEMBER).length, monthlyRevenue, dailyRevenue, recentPayments: payments.slice(-10).reverse(), pendingPaymentMembers, expiringSoonMembers };
  }, [members, payments]);

  const handleLogout = () => { setCurrentUser(null); navigate('/'); };
  
  const handleUpdateMember = (updated: Member) => {
    setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
    if (currentUser?.id === updated.id) setCurrentUser(updated);
  };

  const handleAddPayment = (p: Omit<Payment, 'id'>) => {
    const newPayment = { ...p, id: `p${Date.now()}` };
    setPayments(prev => [...prev, newPayment]);
    
    // Si es un pago mensual de un miembro, actualizar su estado y fecha de próximo cobro
    if (p.memberId && p.type === PaymentType.MONTHLY) {
      setMembers(prev => prev.map(m => {
        if (m.id === p.memberId) {
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          return { 
            ...m, 
            status: MemberStatus.ACTIVE, 
            lastPaymentDate: p.date, 
            nextBillingDate: nextMonth.toISOString().split('T')[0] 
          };
        }
        return m;
      }));
    }
  };

  const handleAskAi = async () => {
    const response = await getGymInsights(stats, "¿Análisis rápido del estado actual?");
    setAiResponse(response);
  };

  if (!currentUser) {
    return viewMode === 'login' ? 
      <LoginView onLogin={setCurrentUser} onSwitchToRegister={() => setViewMode('register')} /> : 
      <RegisterView onRegister={(user) => { setMembers(prev => [...prev, user]); setCurrentUser(user); }} onSwitchToLogin={() => setViewMode('login')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200 overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} role={currentUser.role} />
      
      <main className="flex-1 lg:ml-72 p-6 md:p-12 pb-32 lg:pb-12 relative z-10 max-w-7xl mx-auto w-full">
        <header className="flex items-center justify-between mb-12">
          <button className="lg:hidden p-3 bg-slate-800 rounded-2xl text-slate-400" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
             {currentUser.role === UserRole.ADMIN && (
               <button onClick={handleAskAi} className="p-4 bg-slate-800 rounded-2xl text-emerald-400 hover:bg-slate-700 transition-all border border-slate-700/50 shadow-lg group">
                 <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
               </button>
             )}
             <div className="flex items-center gap-3 bg-slate-800/80 p-2 rounded-2xl border border-slate-700/50 shadow-xl backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white overflow-hidden shadow-inner border border-white/10">
                   {currentUser.profileImage ? <img src={currentUser.profileImage} className="w-full h-full object-cover" /> : <UserIcon size={18} />}
                </div>
                <div className="hidden md:block mr-2">
                   <p className="text-xs font-black text-white leading-none">{currentUser.name}</p>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{currentUser.role === UserRole.ADMIN ? 'Administrador' : 'Socio Atleta'}</p>
                </div>
                <button onClick={handleLogout} className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-xl transition-all" title="Cerrar Sesión">
                  <LogOut size={18} />
                </button>
             </div>
          </div>
        </header>

        {aiResponse && (
          <div className="mb-10 bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-[2.5rem] relative animate-in slide-in-from-top-4 shadow-xl">
            <button onClick={() => setAiResponse(null)} className="absolute top-6 right-6 text-emerald-400/50 hover:text-emerald-400"><X size={18} /></button>
            <div className="flex gap-6 items-start">
               <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-500/20"><TrendingUp size={20} /></div>
               <div className="flex-1">
                  <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Análisis Gemini AI</h4>
                  <p className="text-slate-200 font-medium italic text-base leading-relaxed">"{aiResponse}"</p>
               </div>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={currentUser.role === UserRole.ADMIN ? <DashboardView stats={stats} /> : <MemberDashboardView user={currentUser} payments={payments} />} />
          {currentUser.role === UserRole.ADMIN && (
            <>
              <Route path="/members" element={<MembersView members={members} onUpdateMember={handleUpdateMember} onAddPayment={handleAddPayment} />} />
              <Route path="/payments" element={
                <div className="space-y-10 animate-in fade-in">
                   <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Registro Maestro de Cobros</h2>
                        <p className="text-slate-500 font-medium">Control financiero detallado.</p>
                      </div>
                      <button 
                        onClick={() => {/* Implementar abrir modal general de pagos si es necesario */}} 
                        className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-6 py-3 rounded-2xl transition-all uppercase text-xs tracking-widest flex items-center gap-2"
                      >
                        <Plus size={18} /> Nuevo Pago
                      </button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {payments.slice().reverse().map(p => (
                        <div key={p.id} className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2rem] shadow-xl flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-slate-900 rounded-2xl text-slate-400 group-hover:text-emerald-400 transition-colors"><CreditCard size={20} /></div>
                              <div>
                                 <p className="text-sm font-black text-white">{p.memberName}</p>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase">{p.date}</p>
                              </div>
                           </div>
                           <p className="text-xl font-black text-emerald-400">{p.amount.toLocaleString()} XAF</p>
                        </div>
                      ))}
                   </div>
                </div>
              } />
            </>
          )}
          {currentUser.role === UserRole.MEMBER && (
            <Route path="/payments" element={
              <div className="animate-in fade-in space-y-10">
                <h2 className="text-3xl font-black text-white tracking-tight">Historial de Mis Cuotas</h2>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900/50 text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-700/50">
                        <tr><th className="px-10 py-6">Fecha</th><th className="px-10 py-6">Tipo</th><th className="px-10 py-6">Importe</th></tr>
                    </thead>
                    <tbody className="text-sm font-bold divide-y divide-slate-700/30">
                        {payments.filter(p => p.memberId === currentUser.id).slice().reverse().map(p => (
                          <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                             <td className="px-10 py-6 text-slate-400">{p.date}</td>
                             <td className="px-10 py-6 text-white">{p.type === PaymentType.MONTHLY ? 'Membresía' : 'Ticket Diario'}</td>
                             <td className="px-10 py-6 text-emerald-400 font-black text-lg">{p.amount.toLocaleString()} XAF</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            } />
          )}
          <Route path="/calendar" element={
            <div className="space-y-10 animate-in fade-in">
               <h2 className="text-3xl font-black text-white tracking-tight">Agenda de Entrenamientos</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {events.map(e => (
                    <div key={e.id} className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2.5rem] flex flex-col gap-6 shadow-xl hover:translate-y-[-5px] transition-transform">
                       <div className="bg-slate-900 w-16 h-16 rounded-[1.75rem] flex flex-col items-center justify-center border border-slate-700/50 shadow-2xl">
                          <span className="text-[10px] font-black text-slate-600 uppercase mb-0.5">{new Date(e.date).toLocaleString('es', { month: 'short' })}</span>
                          <span className="text-2xl font-black text-emerald-400 leading-none">{new Date(e.date).getDate()}</span>
                       </div>
                       <div>
                          <h4 className="font-black text-white text-xl leading-tight mb-2">{e.title}</h4>
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-700/30 w-fit">
                             <Clock size={12} className="text-emerald-400" />
                             <span>{e.time}</span>
                          </div>
                       </div>
                       <div className="mt-auto flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><UserIcon size={14} /></div>
                          <p className="text-xs font-bold text-slate-400">Instr: {e.instructor}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 flex justify-around p-5 lg:hidden z-50">
        {[
          { to: '/', icon: LayoutDashboard, label: 'Inicio' },
          { to: '/calendar', icon: CalendarIcon, label: 'Agenda' },
          { to: '/payments', icon: CreditCard, label: 'Pagos' }
        ].map((tab) => {
          const isActive = location.pathname === tab.to;
          return (
            <Link key={tab.to} to={tab.to} className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
              <div className={`p-2 rounded-xl ${isActive ? 'bg-emerald-500/10' : ''}`}><tab.icon size={22} /></div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
