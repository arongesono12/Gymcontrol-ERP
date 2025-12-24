
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
  BellOff,
  ExternalLink, 
  Share2, 
  Download,
  LogOut,
  Lock,
  History,
  Trash2,
  Save,
  Check,
  ChevronDown,
  Settings,
  Shield,
  UserCircle,
  Filter,
  Image as ImageIcon
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

import { Member, Payment, GymEvent, PaymentType, MemberStatus, DashboardStats, UserRole, AppNotification } from './types';
import { INITIAL_MEMBERS, INITIAL_PAYMENTS, INITIAL_EVENTS } from './constants';
import { getGymInsights } from './services/geminiService';

// Logo component for consistent branding
const Logo = ({ className = "w-20 h-20", showText = true, light = false }) => (
  <div className={`flex flex-col items-center ${className}`}>
    <div className={`relative ${light ? 'bg-white' : 'bg-white'} rounded-full p-2 shadow-2xl overflow-hidden mb-4 border-4 border-slate-800`}>
      <div className="w-16 h-16 flex items-center justify-center bg-black text-white rounded-full">
         <Shield size={40} strokeWidth={2.5} />
         <div className="absolute inset-0 flex items-center justify-center">
            <UserIcon size={24} className="mb-1 text-white" strokeWidth={3} />
         </div>
      </div>
    </div>
    {showText && (
      <div className="text-center">
        <h1 className={`text-2xl font-black tracking-tighter ${light ? 'text-white' : 'text-slate-900'} leading-none`}>GYMCONTROL</h1>
        <p className={`text-[8px] font-black uppercase tracking-[0.3em] ${light ? 'text-emerald-400' : 'text-slate-500'} mt-1`}>Work Hard & Play Smart</p>
      </div>
    )}
  </div>
);

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
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block transform hover:scale-105 transition-transform duration-500">
            <Logo light={true} className="w-32 h-32" />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-3xl border border-slate-800 p-10 rounded-[3rem] shadow-2xl space-y-6">
          <div className="text-center mb-4">
             <h2 className="text-xl font-black text-white">ACCESO ADMINISTRATIVO</h2>
             <div className="h-1 w-12 bg-emerald-500 mx-auto mt-2 rounded-full" />
          </div>

          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold text-center animate-shake">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Identificación Email</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="email" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-14 pr-5 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ejemplo@gymcontrol.com" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Contraseña de Seguridad</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="password" name="password" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-14 pr-5 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
          </div>
          
          <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-emerald-400 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-900/20 hover:shadow-emerald-500/30 active:scale-95 transition-all text-sm uppercase tracking-widest">
            Entrar al Sistema
          </button>
          
          <div className="flex justify-between items-center px-2">
             <p className="text-slate-500 text-[10px] font-bold">¿Olvido su acceso?</p>
             <button type="button" onClick={onSwitchToRegister} className="text-emerald-400 text-[10px] font-black hover:underline uppercase tracking-widest">Registrar Atleta</button>
          </div>
        </form>
        
        <p className="text-center text-slate-600 text-[9px] mt-10 font-black uppercase tracking-[0.4em]">Powered by GymControl Enterprise</p>
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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-10 overflow-y-auto max-h-[90vh] shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-white">{member ? 'Editar Miembro' : 'Nuevo Miembro'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ ...formData, id: member?.id || `m-${Date.now()}`, registrationDate: member?.registrationDate || new Date().toISOString().split('T')[0], lastPaymentDate: member?.lastPaymentDate || 'N/A' } as Member); onClose(); }} className="space-y-4">
          <input type="text" placeholder="Nombre completo" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input type="email" placeholder="Email" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input type="text" placeholder="Teléfono" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <select className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value})}>
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
            <select className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as MemberStatus})}>
              <option value={MemberStatus.ACTIVE}>Activo</option>
              <option value={MemberStatus.INACTIVE}>Inactivo</option>
              <option value={MemberStatus.PENDING}>Pendiente</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl hover:bg-emerald-400 flex items-center justify-center gap-2 transition-all active:scale-95"><Save size={18} /> Guardar Cambios</button>
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
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[90] flex items-center justify-center p-4 animate-in zoom-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-black text-white tracking-tight">Registrar Pago</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); const member = members.find(m => m.id === formData.memberId); onAddPayment({ memberId: formData.memberId, memberName: member?.name || 'Desconocido', amount: formData.amount, date: formData.date, type: formData.type }); onClose(); }} className="space-y-6">
          <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={formData.memberId} onChange={(e) => setFormData({ ...formData, memberId: e.target.value })} required>
            <option value="">Seleccionar atleta...</option>
            {members.filter(m => m.role === UserRole.MEMBER).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as PaymentType })}>
              <option value={PaymentType.MONTHLY}>Mensual</option>
              <option value={PaymentType.DAILY}>Diario</option>
            </select>
            <input type="date" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
          </div>
          <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-5 px-6 text-white text-2xl font-black outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} required placeholder="Monto XAF" />
          <button type="submit" className="w-full bg-emerald-500 text-white font-black py-5 rounded-3xl shadow-2xl uppercase text-xs active:scale-95 transition-all">Confirmar Pago</button>
        </form>
      </div>
    </div>
  );
};

// --- In-App Notification Center Component ---

const NotificationCenter = ({ notifications, onMarkAsRead, onClearAll }: { 
  notifications: AppNotification[], 
  onMarkAsRead: (id: string) => void,
  onClearAll: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`p-4 rounded-2xl border border-slate-800 shadow-lg transition-all relative group ${isOpen ? 'bg-slate-800 text-emerald-400' : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800'}`}
      >
        {unreadCount > 0 ? (
          <>
            <Bell size={18} className="animate-wiggle" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-slate-800 rounded-full" />
          </>
        ) : (
          <BellOff size={18} />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-16 right-0 w-80 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl z-[101] overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-6 bg-slate-950/50 border-b border-slate-800 flex justify-between items-center">
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Notificaciones</h4>
              {notifications.length > 0 && (
                <button onClick={onClearAll} className="text-[10px] font-bold text-slate-500 hover:text-red-400 uppercase transition-colors">Limpiar</button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-5 border-b border-slate-800/50 last:border-0 hover:bg-slate-800 transition-colors flex gap-4 ${n.read ? 'opacity-60' : 'opacity-100'}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      n.type === 'warning' ? 'bg-amber-500' : 
                      n.type === 'error' ? 'bg-red-500' : 
                      n.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className={`text-xs font-black text-white mb-1 ${n.read ? 'line-through opacity-50' : ''}`}>{n.title}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{n.message}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-600">{n.timestamp}</span>
                        {!n.read && (
                          <button 
                            onClick={() => onMarkAsRead(n.id)}
                            className="p-1 bg-emerald-500/10 text-emerald-400 rounded-md hover:bg-emerald-500 hover:text-white transition-all"
                          >
                            <Check size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center flex flex-col items-center gap-3">
                  <BellOff size={32} className="text-slate-800" />
                  <p className="text-slate-500 text-xs font-bold">Sin novedades por ahora.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- Reusable Components ---

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
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
      <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-950 border-r border-slate-900 z-[70] transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="mb-12">
            <Logo light={true} className="w-full flex-row items-center gap-4 !items-start" showText={true} />
          </div>
          <nav className="space-y-2 flex-1">
            {menuItems.filter(item => item.roles.includes(role)).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && toggle()}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:bg-slate-900 hover:text-slate-200'}`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto pt-6 border-t border-slate-900">
             <div className="flex items-center gap-3 text-xs font-bold text-slate-600 mb-4 px-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>GymControl Enterprise v2.5</span>
             </div>
          </div>
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
        <StatCard title="Atletas Activos" value={stats.totalMembers} icon={Users} color="bg-blue-600" />
        <StatCard title="En Sala" value={stats.activeMembers} icon={Activity} color="bg-emerald-600" />
        <StatCard title="Recaudación Mes" value={`${stats.monthlyRevenue.toLocaleString()} XAF`} icon={CreditCard} color="bg-purple-600" />
        <StatCard title="Caja Hoy" value={`${stats.dailyRevenue.toLocaleString()} XAF`} icon={DollarSign} color="bg-orange-600" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/50 p-8 rounded-[2.5rem] shadow-2xl border border-slate-800">
          <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3"><TrendingUp size={20} className="text-emerald-400" /> Rendimiento Semanal</h3>
          <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} /><XAxis dataKey="name" stroke="#475569" /><YAxis stroke="#475569" /><Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '1rem' }} /><Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={4} dot={{ fill: '#10b981', r: 6 }} /></LineChart></ResponsiveContainer></div>
        </div>
        <div className="bg-slate-900/50 p-8 rounded-[2.5rem] shadow-2xl border border-slate-800">
           <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3"><Clock size={20} className="text-purple-400" /> Cobros Recientes</h3>
           <div className="space-y-4">
              {stats.recentPayments.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800 transition-colors hover:border-emerald-500/30">
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
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'ALL'>('ALL');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [memberForPayment, setMemberForPayment] = useState<Member | null>(null);
  const cardFileInputRef = useRef<HTMLInputElement>(null);
  const [activeMemberIdForPhoto, setActiveMemberIdForPhoto] = useState<string | null>(null);
  
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = m.role === UserRole.MEMBER;
      const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, searchTerm, statusFilter]);

  const handleCardPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeMemberIdForPhoto) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const member = members.find(m => m.id === activeMemberIdForPhoto);
        if (member) {
          onUpdateMember({ ...member, profileImage: base64 });
        }
        setActiveMemberIdForPhoto(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member && confirm(`¿Deseas eliminar la foto de perfil de ${member.name}?`)) {
      onUpdateMember({ ...member, profileImage: undefined });
    }
  };

  const FilterButton = ({ status, label }: { status: MemberStatus | 'ALL', label: string }) => {
    const isActive = statusFilter === status;
    return (
      <button 
        onClick={() => setStatusFilter(status)}
        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
          isActive 
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
            : 'bg-slate-900/50 text-slate-500 hover:text-slate-300 border border-slate-800'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <input 
        type="file" 
        ref={cardFileInputRef} 
        onChange={handleCardPhotoUpload} 
        className="hidden" 
        accept="image/*" 
      />

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Gestión de Atletas</h2>
          <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">Listado de miembros y control de acceso</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2 bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
            <FilterButton status="ALL" label="Todos" />
            <FilterButton status={MemberStatus.ACTIVE} label="Activos" />
            <FilterButton status={MemberStatus.INACTIVE} label="Inactivos" />
            <FilterButton status={MemberStatus.PENDING} label="Pendientes" />
          </div>
          <div className="flex gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input type="text" placeholder="Buscar por nombre..." className="bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none w-full md:w-64 transition-all focus:ring-2 focus:ring-emerald-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={() => { setEditingMember(null); setIsEditorOpen(true); }} className="bg-emerald-500 text-white p-3 rounded-2xl hover:bg-emerald-400 transition-all shadow-lg active:scale-90 flex-shrink-0"><Plus size={24} /></button>
          </div>
        </div>
      </div>

      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredMembers.map((m) => (
            <div key={m.id} className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl hover:shadow-emerald-500/5 transition-all group flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="relative group/avatar">
                  <div className="w-20 h-20 rounded-3xl bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-emerald-400 overflow-hidden shadow-2xl transition-transform group-hover/avatar:scale-105">
                    {m.profileImage ? <img src={m.profileImage} className="w-full h-full object-cover" /> : <UserIcon size={32} />}
                  </div>
                  {/* Photo Actions Over Avatar */}
                  <div className="absolute -bottom-1 -right-1 flex gap-1 translate-y-2 opacity-0 group-hover/avatar:translate-y-0 group-hover/avatar:opacity-100 transition-all duration-300">
                    <button 
                      onClick={() => { setActiveMemberIdForPhoto(m.id); cardFileInputRef.current?.click(); }}
                      title="Subir Foto"
                      className="p-1.5 bg-emerald-500 text-white rounded-lg shadow-xl hover:bg-emerald-400 transition-colors"
                    >
                      <Camera size={14} />
                    </button>
                    {m.profileImage && (
                      <button 
                        onClick={() => handleRemovePhoto(m.id)}
                        title="Eliminar Foto"
                        className="p-1.5 bg-red-500 text-white rounded-lg shadow-xl hover:bg-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase border ${
                  m.status === MemberStatus.ACTIVE ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  m.status === MemberStatus.INACTIVE ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>{m.status}</span>
              </div>
              <h3 className="text-xl font-black text-white truncate">{m.name}</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 mb-4">{m.plan}</p>
              <div className="space-y-1 text-xs text-slate-400 mb-6 bg-slate-950/40 p-3 rounded-xl">
                <p className="flex items-center gap-2"><Phone size={12} className="text-emerald-500" /> {m.phone}</p>
                <p className="flex items-center gap-2"><CalendarDays size={12} className="text-emerald-500" /> Reg: {m.registrationDate}</p>
              </div>
              <div className="mt-auto pt-6 border-t border-slate-800/50 flex flex-col gap-3">
                <button onClick={() => setMemberForPayment(m)} className="w-full flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white font-black py-3 rounded-2xl transition-all text-[10px] uppercase shadow-inner active:scale-95"><CreditCard size={14} /> Cobrar Mensualidad</button>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingMember(m); setIsEditorOpen(true); }} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-2xl transition-all flex justify-center items-center active:scale-95"><Edit2 size={14} /></button>
                  <button onClick={() => { if(confirm('¿Seguro que quieres eliminar a '+m.name+'?')) onDeleteMember(m.id); }} className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-2xl transition-all flex justify-center items-center active:scale-95"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center bg-slate-900/20 border border-slate-800 rounded-[3rem] text-slate-600 gap-4">
           <div className="p-6 bg-slate-900 rounded-full">
              <Filter size={48} className="opacity-20" />
           </div>
           <p className="font-bold text-sm">No se encontraron atletas con los criterios seleccionados.</p>
           <button onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }} className="text-emerald-400 text-xs font-black uppercase tracking-widest hover:underline">Limpiar filtros</button>
        </div>
      )}
      
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
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
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
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
    // Si el usuario actualizado es el actual, también lo actualizamos
    if (currentUser && currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const updatedUser = { ...currentUser, profileImage: base64 };
        handleUpdateMember(updatedUser);
        setIsProfileDropdownOpen(false);
      };
      reader.readAsDataURL(file);
    }
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

  if (!currentUser) return <LoginView onLogin={setCurrentUser} onSwitchToRegister={() => {}} />;

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200 selection:bg-emerald-500">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handlePhotoUpload} 
        className="hidden" 
        accept="image/*" 
      />
      
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} role={currentUser.role} />
      
      <main className="flex-1 lg:ml-72 p-6 md:p-12 pb-32 lg:pb-12 max-w-7xl mx-auto w-full relative z-10">
        <header className="flex items-center justify-between mb-12">
          <button className="lg:hidden p-3 bg-slate-900 rounded-2xl border border-slate-800" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
          <div className="flex-1 px-4">
             <div className="hidden lg:block">
                <h1 className="text-sm font-black text-slate-500 uppercase tracking-widest leading-none">Management Center</h1>
                <p className="text-white font-black text-2xl mt-1">GymControl Suite</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             {currentUser.role === UserRole.ADMIN && (
               <button onClick={async () => setAiResponse(await getGymInsights(stats, "¿Estado actual?"))} className="p-4 bg-slate-900/50 rounded-2xl text-emerald-400 border border-slate-800 shadow-lg hover:bg-slate-800 transition-all">
                 <MessageSquare size={18} />
               </button>
             )}
             
             <NotificationCenter 
               notifications={notifications} 
               onMarkAsRead={markAsRead} 
               onClearAll={clearAllNotifications} 
             />

             {/* Profile Dropdown */}
             <div className="relative">
               <button 
                 onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                 className={`flex items-center gap-3 bg-slate-900/80 p-2 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md transition-all hover:bg-slate-800 ${isProfileDropdownOpen ? 'ring-2 ring-emerald-500' : ''}`}
               >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white overflow-hidden shadow-inner border border-white/10 relative group/avatar">
                    {currentUser.profileImage ? (
                      <img src={currentUser.profileImage} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <UserIcon size={18} />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera size={12} className="text-white" />
                    </div>
                  </div>
                  <div className="hidden md:block mr-2 text-left">
                    <p className="text-xs font-black text-white leading-none">{currentUser.name}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{currentUser.role === UserRole.ADMIN ? 'Administrador' : 'Atleta'}</p>
                  </div>
                  <ChevronDown size={14} className={`text-slate-500 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
               </button>

               {isProfileDropdownOpen && (
                 <>
                   <div className="fixed inset-0 z-[100]" onClick={() => setIsProfileDropdownOpen(false)} />
                   <div className="absolute top-16 right-0 w-64 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl z-[101] overflow-hidden animate-in fade-in slide-in-from-top-2">
                     <div className="p-6 bg-slate-950/50 border-b border-slate-800">
                        <div className="flex items-center gap-3 mb-3">
                           <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                              <UserCircle size={24} />
                           </div>
                           <div className="flex-1 overflow-hidden">
                              <p className="text-xs font-black text-white truncate">{currentUser.name}</p>
                              <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                           </div>
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Control ID: {currentUser.id}</p>
                     </div>
                     <div className="p-2">
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex items-center gap-4 p-4 text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-emerald-400 rounded-xl transition-all"
                        >
                          <Camera size={18} /> Subir Nueva Foto
                        </button>
                        <button className="w-full flex items-center gap-4 p-4 text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
                          <Settings size={18} /> Ajustes de ERP
                        </button>
                        {currentUser.role === UserRole.ADMIN && (
                          <button className="w-full flex items-center gap-4 p-4 text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-cyan-400 rounded-xl transition-all">
                            <Shield size={18} /> Seguridad
                          </button>
                        )}
                        <div className="my-2 border-t border-slate-800/50" />
                        <button 
                          onClick={() => { setCurrentUser(null); setIsProfileDropdownOpen(false); }}
                          className="w-full flex items-center gap-4 p-4 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <LogOut size={18} /> Cerrar Sesión
                        </button>
                     </div>
                   </div>
                 </>
               )}
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
          <Route path="/" element={currentUser.role === UserRole.ADMIN ? <DashboardView stats={stats} /> : (
            <div className="animate-in fade-in space-y-8">
              <div className="bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center gap-10">
                 <div className="w-40 h-40 rounded-[3rem] bg-slate-950 border-4 border-slate-900 shadow-2xl overflow-hidden relative group/hero">
                    {currentUser.profileImage ? <img src={currentUser.profileImage} className="w-full h-full object-cover" /> : <UserIcon size={64} className="m-auto mt-12 text-slate-800" />}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover/hero:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <Camera size={32} className="text-white" />
                    </button>
                 </div>
                 <div className="flex-1 text-center md:text-left">
                   <h2 className="text-4xl font-black text-white mb-2">¡Bienvenido Atleta, {currentUser.name}!</h2>
                   <p className="text-slate-500 font-medium mb-6">"Work Hard & Play Smart". Tu rendimiento es nuestra prioridad.</p>
                   <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <div className="bg-slate-950/50 px-6 py-3 rounded-2xl border border-slate-800">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Membresía</p>
                        <p className="text-emerald-400 font-black tracking-widest uppercase text-sm">{currentUser.plan}</p>
                      </div>
                      <div className="bg-slate-950/50 px-6 py-3 rounded-2xl border border-slate-800">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Próximo Pago</p>
                        <p className="text-white font-black">{currentUser.nextBillingDate || 'No definida'}</p>
                      </div>
                   </div>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800">
                    <h3 className="text-lg font-black text-white mb-6">Agenda de Clases</h3>
                    <div className="space-y-4">
                       {INITIAL_EVENTS.map(e => (
                         <div key={e.id} className="flex justify-between items-center bg-slate-950/40 p-4 rounded-xl border border-transparent hover:border-emerald-500/20 transition-all">
                            <div><p className="font-bold text-white text-sm">{e.title}</p><p className="text-[10px] text-slate-500 uppercase font-black">{e.instructor}</p></div>
                            <span className="text-emerald-400 font-black text-xs bg-emerald-500/10 px-3 py-1 rounded-full">{e.time}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800">
                    <h3 className="text-lg font-black text-white mb-6">Comunicados Oficiales</h3>
                    <div className="flex flex-col items-center justify-center h-40 text-slate-800">
                       <MessageSquare size={32} className="mb-2 opacity-10" />
                       <p className="text-xs font-bold italic text-slate-600">No hay nuevos comunicados en el tablero.</p>
                    </div>
                 </div>
              </div>
            </div>
          )} />
          {currentUser.role === UserRole.ADMIN && (
            <>
              <Route path="/members" element={<MembersView members={members} onUpdateMember={handleUpdateMember} onDeleteMember={onDeleteMember} onAddPayment={onAddPayment} />} />
              <Route path="/payments" element={
                <div className="space-y-10 animate-in fade-in">
                   <h2 className="text-3xl font-black text-white tracking-tight">Registro Maestro de Cobros</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {payments.slice().reverse().map(p => (
                        <div key={p.id} className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] shadow-xl flex justify-between items-center group hover:border-emerald-500/30 transition-all relative">
                           <button onClick={() => { if(confirm('¿Eliminar registro?')) setPayments(prev => prev.filter(x => x.id !== p.id)); }} className="absolute top-4 right-4 text-slate-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12} /></button>
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-slate-950 rounded-2xl text-slate-600 group-hover:text-emerald-400 transition-colors"><CreditCard size={20} /></div>
                              <div><p className="text-sm font-black text-white">{p.memberName}</p><p className="text-[10px] font-bold text-slate-600 uppercase">{p.date}</p></div>
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
               <h2 className="text-3xl font-black text-white tracking-tight">Agenda Corporativa de Entrenamientos</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {events.map(e => (
                    <div key={e.id} className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col gap-6 shadow-xl hover:translate-y-[-5px] transition-transform">
                       <div className="bg-slate-950 w-16 h-16 rounded-[1.75rem] flex flex-col items-center justify-center border border-slate-800 shadow-2xl">
                          <span className="text-[10px] font-black text-slate-600 uppercase mb-0.5">{new Date(e.date).toLocaleString('es', { month: 'short' })}</span>
                          <span className="text-2xl font-black text-emerald-400 leading-none">{new Date(e.date).getDate()}</span>
                       </div>
                       <div>
                          <h4 className="font-black text-white text-xl leading-tight mb-2">{e.title}</h4>
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950/50 px-3 py-1.5 rounded-xl border border-slate-800 w-fit">
                             <Clock size={12} className="text-emerald-400" />
                             <span>{e.time}</span>
                          </div>
                       </div>
                       <div className="mt-auto flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><UserIcon size={14} /></div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Instructor: {e.instructor}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-900 flex justify-around p-5 lg:hidden z-50 shadow-2xl">
        <Link to="/" className="flex flex-col items-center gap-1 text-slate-500 hover:text-emerald-400 transition-colors"><LayoutDashboard size={22} /><span className="text-[9px] font-black uppercase tracking-widest">Dashboard</span></Link>
        <Link to="/calendar" className="flex flex-col items-center gap-1 text-slate-500 hover:text-emerald-400 transition-colors"><CalendarIcon size={22} /><span className="text-[9px] font-black uppercase tracking-widest">Agenda</span></Link>
        <Link to="/payments" className="flex flex-col items-center gap-1 text-slate-500 hover:text-emerald-400 transition-colors"><CreditCard size={22} /><span className="text-[9px] font-black uppercase tracking-widest">Finanzas</span></Link>
      </nav>
    </div>
  );
};

export default function App() { return <HashRouter><AppContent /></HashRouter>; }
