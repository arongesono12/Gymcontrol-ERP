
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Calendar as CalendarIcon, 
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
  History,
  Trash2,
  Save
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
      setError('Credenciales inválidas. Prueba con admesono@gymcontrol.com / Admin1234@');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[150px] animate-pulse" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl shadow-xl shadow-emerald-500/20 mb-6">
            <TrendingUp size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">GymControl ERP</h1>
          <p className="text-slate-500 mt-2 font-medium">Gestión Profesional para Centros Fitness.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-10 rounded-[2.5rem] shadow-2xl space-y-6">
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold text-center">{error}</div>}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email</label>
            <input type="email" className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-5 text-white font-bold" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Contraseña</label>
            <input type="password" className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-5 text-white font-bold" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-emerald-400 active:scale-95 transition-all text-sm uppercase">Entrar al Sistema</button>
          <p className="text-center text-slate-500 text-xs font-bold">¿No tienes cuenta? <button type="button" onClick={onSwitchToRegister} className="text-emerald-400 hover:underline">Registrar Atleta</button></p>
        </form>
      </div>
    </div>
  );
};

// --- Modals for CRUD ---

const MemberEditorModal = ({ 
  isOpen, 
  onClose, 
  member, 
  onSave 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  member?: Member | null, 
  onSave: (m: Member) => void 
}) => {
  const [formData, setFormData] = useState<Partial<Member>>({
    name: '', email: '', phone: '', status: MemberStatus.ACTIVE, plan: 'Basic', role: UserRole.MEMBER, password: 'user123'
  });

  useEffect(() => {
    if (member) setFormData(member);
    else setFormData({ name: '', email: '', phone: '', status: MemberStatus.ACTIVE, plan: 'Basic', role: UserRole.MEMBER, password: 'user123' });
  }, [member, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-[2.5rem] p-10 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-white">{member ? 'Editar Miembro' : 'Nuevo Miembro'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ ...formData, id: member?.id || `m-${Date.now()}`, registrationDate: member?.registrationDate || new Date().toISOString().split('T')[0], lastPaymentDate: member?.lastPaymentDate || 'N/A' } as Member); onClose(); }} className="space-y-4">
          <input type="text" placeholder="Nombre completo" className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input type="email" placeholder="Email" className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input type="text" placeholder="Teléfono" className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <select className="bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white" value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value})}>
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
            <select className="bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as MemberStatus})}>
              <option value={MemberStatus.ACTIVE}>Activo</option>
              <option value={MemberStatus.INACTIVE}>Inactivo</option>
              <option value={MemberStatus.PENDING}>Pendiente</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl hover:bg-emerald-400 flex items-center justify-center gap-2"><Save size={18} /> Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

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
  }, [initialMemberId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[90] flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700/50 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-black text-white tracking-tight">Registrar Pago</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); const member = members.find(m => m.id === formData.memberId); onAddPayment({ memberId: formData.memberId, memberName: member?.name || 'Desconocido', amount: formData.amount, date: formData.date, type: formData.type }); onClose(); }} className="space-y-6">
          <select className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white font-bold" value={formData.memberId} onChange={(e) => setFormData({ ...formData, memberId: e.target.value })} required>
            <option value="">Seleccionar atleta...</option>
            {members.filter(m => m.role === UserRole.MEMBER).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <select className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white font-bold" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as PaymentType })}>
              <option value={PaymentType.MONTHLY}>Mensual</option>
              <option value={PaymentType.DAILY}>Diario</option>
            </select>
            <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white font-bold" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
          </div>
          <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-3xl py-5 px-6 text-white text-2xl font-black" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} required placeholder="Monto XAF" />
          <button type="submit" className="w-full bg-emerald-500 text-white font-black py-5 rounded-3xl shadow-2xl uppercase text-xs">Confirmar Pago</button>
        </form>
      </div>
    </div>
  );
};

// --- Reusable Components ---

// Fix: Added StatCard component
const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-700/50 shadow-2xl relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-5 blur-[60px] group-hover:opacity-10 transition-opacity`} />
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{title}</p>
        <h4 className="text-3xl font-black text-white tracking-tighter">{value}</h4>
      </div>
      <div className={`p-4 ${color} rounded-2xl text-white shadow-xl`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

// Fix: Added Sidebar component
const Sidebar = ({ isOpen, toggle, role }: { isOpen: boolean, toggle: () => void, role: UserRole }) => {
  const location = useLocation();
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: [UserRole.ADMIN, UserRole.MEMBER] },
    { icon: Users, label: 'Atletas', path: '/members', roles: [UserRole.ADMIN] },
    { icon: CreditCard, label: 'Cobros', path: '/payments', roles: [UserRole.ADMIN] },
    { icon: CalendarIcon, label: 'Agenda', path: '/calendar', roles: [UserRole.ADMIN, UserRole.MEMBER] },
  ];

  return (
    <>
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggle} />
      <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-900 border-r border-slate-800 z-[70] transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
              <TrendingUp size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tighter uppercase">GymControl</h1>
          </div>
          <nav className="space-y-2">
            {menuItems.filter(item => item.roles.includes(role)).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && toggle()}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'}`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

// --- View Components ---

const DashboardView = ({ stats }: { stats: DashboardStats }) => {
  const weeklyData = [{ name: 'Lun', ingresos: 12000 }, { name: 'Mar', ingresos: 21000 }, { name: 'Mie', ingresos: 18000 }, { name: 'Jue', ingresos: 30000 }, { name: 'Vie', ingresos: 45000 }, { name: 'Sab', ingresos: 32000 }, { name: 'Dom', ingresos: 15000 }];
  return (
    <div className="space-y-10 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Atletas" value={stats.totalMembers} icon={Users} color="bg-blue-600" />
        <StatCard title="En Sala" value={stats.activeMembers} icon={Activity} color="bg-emerald-600" />
        <StatCard title="Recaudación Mes" value={`${stats.monthlyRevenue.toLocaleString()} XAF`} icon={CreditCard} color="bg-purple-600" />
        <StatCard title="Caja Hoy" value={`${stats.dailyRevenue.toLocaleString()} XAF`} icon={DollarSign} color="bg-orange-600" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800/50 p-8 rounded-[2.5rem] shadow-2xl border border-slate-700/50">
          <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3"><TrendingUp size={20} className="text-emerald-400" /> Rendimiento Semanal</h3>
          <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} /><XAxis dataKey="name" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} /><Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={4} dot={{ fill: '#10b981', r: 6 }} /></LineChart></ResponsiveContainer></div>
        </div>
        <div className="bg-slate-800/50 p-8 rounded-[2.5rem] shadow-2xl border border-slate-700/50">
           <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3"><Clock size={20} className="text-purple-400" /> Cobros Recientes</h3>
           <div className="space-y-4">
              {stats.recentPayments.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-slate-900/40 rounded-2xl border border-slate-700/30">
                  <div><p className="font-bold text-white text-sm">{p.memberName}</p><p className="text-[9px] uppercase text-slate-500">{p.date}</p></div>
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
  onDeleteMember,
  onAddPayment 
}: { 
  members: Member[], 
  onUpdateMember: (m: Member) => void,
  onDeleteMember: (id: string) => void,
  onAddPayment: (p: Omit<Payment, 'id'>) => void
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [memberForPayment, setMemberForPayment] = useState<Member | null>(null);
  
  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) && m.role === UserRole.MEMBER);

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div><h2 className="text-3xl font-black text-white tracking-tight">Gestión de Atletas</h2></div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="text" placeholder="Buscar..." className="bg-slate-800 border border-slate-700 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button onClick={() => { setEditingMember(null); setIsEditorOpen(true); }} className="bg-emerald-500 text-white p-3 rounded-2xl hover:bg-emerald-400 transition-all shadow-lg"><Plus size={24} /></button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredMembers.map((m) => (
          <div key={m.id} className="bg-slate-800/40 border border-slate-700/50 rounded-[2.5rem] p-8 shadow-xl hover:shadow-emerald-500/5 transition-all group flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="w-20 h-20 rounded-3xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-emerald-400 overflow-hidden shadow-2xl">
                {m.profileImage ? <img src={m.profileImage} className="w-full h-full object-cover" /> : <UserIcon size={32} />}
              </div>
              <span className={`px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase border ${m.status === MemberStatus.ACTIVE ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{m.status}</span>
            </div>
            <h3 className="text-xl font-black text-white truncate">{m.name}</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 mb-4">{m.plan}</p>
            <div className="space-y-1 text-xs text-slate-400 mb-6">
              <p className="flex items-center gap-2"><Phone size={12} /> {m.phone}</p>
              <p className="flex items-center gap-2"><CalendarDays size={12} /> Reg: {m.registrationDate}</p>
            </div>
            <div className="mt-auto pt-6 border-t border-slate-700/30 flex flex-col gap-3">
              <button onClick={() => setMemberForPayment(m)} className="w-full flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white font-black py-3 rounded-2xl transition-all text-[10px] uppercase"><CreditCard size={14} /> Cobrar</button>
              <div className="flex gap-2">
                <button onClick={() => { setEditingMember(m); setIsEditorOpen(true); }} className="flex-1 bg-slate-700/30 hover:bg-slate-700 text-slate-300 py-3 rounded-2xl transition-all flex justify-center items-center"><Edit2 size={14} /></button>
                <button onClick={() => { if(confirm('¿Seguro que quieres eliminar a '+m.name+'?')) onDeleteMember(m.id); }} className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-2xl transition-all flex justify-center items-center"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <MemberEditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} member={editingMember} onSave={onUpdateMember} />
      <PaymentRegistrationModal isOpen={!!memberForPayment} onClose={() => setMemberForPayment(null)} members={members} onAddPayment={onAddPayment} initialMemberId={memberForPayment?.id} />
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
  const navigate = useNavigate();

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

  if (!currentUser) return <LoginView onLogin={setCurrentUser} onSwitchToRegister={() => {}} />;

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200 selection:bg-emerald-500">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} role={currentUser.role} />
      <main className="flex-1 lg:ml-72 p-6 md:p-12 pb-32 lg:pb-12 max-w-7xl mx-auto w-full relative z-10">
        <header className="flex items-center justify-between mb-12">
          <button className="lg:hidden p-3 bg-slate-800 rounded-2xl" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
             {currentUser.role === UserRole.ADMIN && <button onClick={async () => setAiResponse(await getGymInsights(stats, "¿Estado actual?"))} className="p-4 bg-slate-800 rounded-2xl text-emerald-400 border border-slate-700 shadow-lg"><MessageSquare size={18} /></button>}
             <div className="flex items-center gap-3 bg-slate-800/80 p-2 rounded-2xl border border-slate-700/50 shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white overflow-hidden shadow-inner">{currentUser.profileImage ? <img src={currentUser.profileImage} className="w-full h-full object-cover" /> : <UserIcon size={18} />}</div>
                <div className="hidden md:block mr-2 text-left"><p className="text-xs font-black text-white leading-none">{currentUser.name}</p><p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{currentUser.role === UserRole.ADMIN ? 'Administrador' : 'Socio'}</p></div>
                <button onClick={() => setCurrentUser(null)} className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-xl transition-all"><LogOut size={18} /></button>
             </div>
          </div>
        </header>

        {aiResponse && (
          <div className="mb-10 bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-[2.5rem] relative animate-in slide-in-from-top-4 shadow-xl flex gap-6">
            <button onClick={() => setAiResponse(null)} className="absolute top-6 right-6 text-emerald-400/50 hover:text-emerald-400"><X size={18} /></button>
            <div className="p-3 bg-emerald-500 rounded-2xl text-white h-fit shadow-lg shadow-emerald-500/20"><TrendingUp size={20} /></div>
            <p className="text-slate-200 font-medium italic text-base leading-relaxed">"{aiResponse}"</p>
          </div>
        )}

        <Routes>
          <Route path="/" element={currentUser.role === UserRole.ADMIN ? <DashboardView stats={stats} /> : <div className="p-10 bg-slate-800 rounded-3xl">Bienvenido, Atleta. Próximamente tu historial aquí.</div>} />
          {currentUser.role === UserRole.ADMIN && (
            <>
              <Route path="/members" element={<MembersView members={members} onUpdateMember={handleUpdateMember} onDeleteMember={onDeleteMember} onAddPayment={onAddPayment} />} />
              <Route path="/payments" element={
                <div className="space-y-10 animate-in fade-in">
                   <h2 className="text-3xl font-black text-white tracking-tight">Registro Maestro de Cobros</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {payments.slice().reverse().map(p => (
                        <div key={p.id} className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2rem] shadow-xl flex justify-between items-center group hover:border-emerald-500/30 transition-all relative">
                           <button onClick={() => { if(confirm('¿Eliminar registro?')) setPayments(prev => prev.filter(x => x.id !== p.id)); }} className="absolute top-4 right-4 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12} /></button>
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-slate-900 rounded-2xl text-slate-400 group-hover:text-emerald-400 transition-colors"><CreditCard size={20} /></div>
                              <div><p className="text-sm font-black text-white">{p.memberName}</p><p className="text-[10px] font-bold text-slate-500 uppercase">{p.date}</p></div>
                           </div>
                           <p className="text-xl font-black text-emerald-400">{p.amount.toLocaleString()} XAF</p>
                        </div>
                      ))}
                   </div>
                </div>
              } />
            </>
          )}
          <Route path="/calendar" element={
            <div className="space-y-10 animate-in fade-in">
               <h2 className="text-3xl font-black text-white tracking-tight">Agenda de Entrenamientos</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {events.map(e => (
                    <div key={e.id} className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2.5rem] flex flex-col gap-6 shadow-xl hover:translate-y-[-5px] transition-transform">
                       <div className="bg-slate-900 w-16 h-16 rounded-[1.75rem] flex flex-col items-center justify-center border border-slate-700/50">
                          <span className="text-[10px] font-black text-slate-600 uppercase">{new Date(e.date).toLocaleString('es', { month: 'short' })}</span>
                          <span className="text-2xl font-black text-emerald-400">{new Date(e.date).getDate()}</span>
                       </div>
                       <h4 className="font-black text-white text-xl leading-tight">{e.title}</h4>
                       <div className="mt-auto flex items-center gap-3"><div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><UserIcon size={14} /></div><p className="text-xs font-bold text-slate-400">{e.instructor}</p></div>
                    </div>
                  ))}
               </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 flex justify-around p-5 lg:hidden z-50">
        <Link to="/" className="flex flex-col items-center gap-1 text-slate-500 hover:text-emerald-400"><LayoutDashboard size={22} /><span className="text-[9px] font-black uppercase tracking-widest">Inicio</span></Link>
        <Link to="/calendar" className="flex flex-col items-center gap-1 text-slate-500 hover:text-emerald-400"><CalendarIcon size={22} /><span className="text-[9px] font-black uppercase tracking-widest">Agenda</span></Link>
        <Link to="/payments" className="flex flex-col items-center gap-1 text-slate-500 hover:text-emerald-400"><CreditCard size={22} /><span className="text-[9px] font-black uppercase tracking-widest">Pagos</span></Link>
      </nav>
    </div>
  );
};

export default function App() { return <HashRouter><AppContent /></HashRouter>; }
