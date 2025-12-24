
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
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
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Camera,
  Upload,
  AlertTriangle,
  Bell,
  ExternalLink,
  BellOff
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Cell
} from 'recharts';

import { Member, Payment, GymEvent, PaymentType, MemberStatus, DashboardStats } from './types';
import { INITIAL_MEMBERS, INITIAL_PAYMENTS, INITIAL_EVENTS } from './constants';
import { getGymInsights } from './services/geminiService';

// --- Components ---

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

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Panel Control', icon: LayoutDashboard },
    { path: '/members', label: 'Miembros', icon: Users },
    { path: '/payments', label: 'Pagos', icon: CreditCard },
    { path: '/calendar', label: 'Calendario', icon: CalendarIcon },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggle}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800/50 z-50 transform transition-transform duration-500 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20">
              <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white leading-none">GymControl</h1>
              <p className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase mt-1">SaaS ERP</p>
            </div>
          </div>
          <nav className="space-y-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && toggle()}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

// --- View Modals ---

const EditPaymentModal = ({ payment, onClose, onSave }: { payment: Payment, onClose: () => void, onSave: (updated: Payment) => void }) => {
  const [formData, setFormData] = useState<Payment>({ ...payment });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700/50 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="bg-slate-900/50 p-6 flex justify-between items-center border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <Edit2 className="text-emerald-400" size={18} />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">Editar Pago</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-700 transition-all">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Miembro / Cliente</p>
              <p className="text-white font-black">{payment.memberName}</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monto (XAF)</label>
              <div className="relative group">
                <input 
                  type="number"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-4 pr-14 text-white font-black text-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-black text-xs">XAF</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fecha de Pago</label>
              <input 
                type="date"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
            >
              Actualizar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditMemberModal = ({ member, onClose, onSave }: { member: Member, onClose: () => void, onSave: (updated: Member) => void }) => {
  const [formData, setFormData] = useState<Member>({ ...member });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700/50 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="bg-slate-900/50 p-6 flex justify-between items-center border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <Edit2 className="text-emerald-400" size={18} />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">Editar Miembro</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-700 transition-all">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div 
              className="relative w-28 h-28 group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-full h-full rounded-[2rem] bg-slate-900 border-2 border-slate-700 overflow-hidden shadow-2xl transition-all group-hover:border-emerald-500">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <UserIcon size={40} />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="text-white" size={24} />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                <Upload size={14} />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange}
            />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Click para cambiar foto</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nombre Completo</label>
              <input 
                type="text"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</label>
              <input 
                type="email"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Teléfono</label>
              <input 
                type="tel"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Plan de Membresía</label>
              <select 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                required
              >
                <option value="Basic">Plan Básico</option>
                <option value="Standard">Plan Estándar</option>
                <option value="Premium">Plan Premium</option>
                <option value="VIP">Plan VIP</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MemberDetailsModal = ({ member, onClose }: { member: Member, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[70] flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700/50 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-cyan-600 p-10 flex justify-between items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-24 h-24 bg-white/20 rounded-[2.5rem] flex items-center justify-center backdrop-blur-md border border-white/30 shadow-2xl overflow-hidden">
              {member.profileImage ? (
                <img src={member.profileImage} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={40} className="text-white" />
              )}
            </div>
            <div>
              <h3 className="text-3xl font-black text-white tracking-tight leading-tight">{member.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/20 text-white backdrop-blur-sm border border-white/20 flex items-center gap-1.5`}>
                  <div className={`w-2 h-2 rounded-full ${member.status === MemberStatus.ACTIVE ? 'bg-emerald-300 animate-pulse' : 'bg-red-400'}`} />
                  {member.status === MemberStatus.ACTIVE ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-2 rounded-2xl hover:bg-white/10 transition-all relative z-10">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Correo Electrónico</p>
              <div className="flex items-center gap-3 text-slate-200">
                <div className="p-2 bg-slate-900 rounded-lg text-emerald-400"><Mail size={16} /></div>
                <span className="font-semibold text-sm truncate">{member.email}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">WhatsApp / Tel</p>
              <div className="flex items-center gap-3 text-slate-200">
                <div className="p-2 bg-slate-900 rounded-lg text-emerald-400"><Phone size={16} /></div>
                <span className="font-semibold text-sm">{member.phone}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Plan Contratado</p>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 rounded-lg text-blue-400 font-black text-xs">P</div>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-black uppercase">
                  {member.plan}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alta en Sistema</p>
              <div className="flex items-center gap-3 text-slate-200">
                <div className="p-2 bg-slate-900 rounded-lg text-emerald-400"><CalendarDays size={16} /></div>
                <span className="font-semibold text-sm">{member.registrationDate}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-700/50 flex justify-between items-center group">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Último Pago Confirmado</p>
              <p className="text-xl font-black text-emerald-400">{member.lastPaymentDate} XAF</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Suscripción</p>
              <p className={`text-sm font-bold flex items-center justify-end gap-2 ${member.isRecurring ? 'text-emerald-400' : 'text-slate-500'}`}>
                {member.isRecurring ? <><RefreshCw size={14} className="animate-spin-slow" /> Recurrente</> : 'Única'}
              </p>
            </div>
          </div>

          {member.isRecurring && (
            <div className="bg-emerald-500/5 p-5 rounded-3xl border border-emerald-500/10 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                <Clock className="text-white" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Próximo Débito Automático</p>
                <p className="text-md font-bold text-slate-200">{member.nextBillingDate}</p>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <button onClick={onClose} className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-white font-black py-4 rounded-2xl transition-all">
              Cerrar Panel
            </button>
            <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20">
              Ver Historial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Views ---

const DashboardView = ({ stats }: { stats: DashboardStats }) => {
  const [reportType, setReportType] = useState<'mensual' | 'anual'>('mensual');

  const weeklyData = [
    { name: 'Lun', ingresos: 12000 },
    { name: 'Mar', ingresos: 21000 },
    { name: 'Mie', ingresos: 18000 },
    { name: 'Jue', ingresos: 30000 },
    { name: 'Vie', ingresos: 45000 },
    { name: 'Sab', ingresos: 32000 },
    { name: 'Dom', ingresos: 15000 },
  ];

  const monthlyData = [
    { name: 'Ene', total: 1200000 },
    { name: 'Feb', total: 1500000 },
    { name: 'Mar', total: 1800000 },
    { name: 'Abr', total: 1400000 },
    { name: 'May', total: stats.monthlyRevenue },
    { name: 'Jun', total: 1600000 },
  ];

  const yearlyData = [
    { name: '2021', total: 15000000 },
    { name: '2022', total: 22000000 },
    { name: '2023', total: 31000000 },
    { name: '2024', total: 18000000 },
  ];

  const currentReportData = reportType === 'mensual' ? monthlyData : yearlyData;
  const totalAlerts = stats.pendingPaymentMembers.length + stats.expiringSoonMembers.length;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Miembros" value={stats.totalMembers} icon={Users} color="bg-gradient-to-br from-blue-500 to-indigo-600" />
        <StatCard title="En Sala" value={stats.activeMembers} icon={Activity} color="bg-gradient-to-br from-emerald-500 to-teal-600" />
        <StatCard title="Mensualidades" value={`${stats.monthlyRevenue.toLocaleString()} XAF`} icon={CreditCard} color="bg-gradient-to-br from-purple-500 to-fuchsia-600" />
        <StatCard title="Caja de Hoy" value={`${stats.dailyRevenue.toLocaleString()} XAF`} icon={DollarSign} color="bg-gradient-to-br from-orange-500 to-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-white flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400"><TrendingUp size={20} /></div>
              Flujo Semanal
            </h3>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-900/50 px-3 py-1 rounded-full">Actualizado hace 2m</div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', color: '#fff' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  formatter={(value: number) => [`${value.toLocaleString()} XAF`, 'Ingresos']}
                />
                <Line 
                  type="monotone" 
                  dataKey="ingresos" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  dot={{ fill: '#10b981', r: 6, strokeWidth: 2, stroke: '#1e293b' }} 
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400"><Clock size={20} /></div>
              Actividad Reciente
            </h3>
            <div className="space-y-5 relative z-10">
              {stats.recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-slate-900/40 hover:bg-slate-900/60 transition-all rounded-2xl border border-slate-700/30 group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-1.5 h-10 rounded-full transition-all ${p.isRecurring ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                    <div>
                      <p className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">{p.memberName}</p>
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                        {p.type === PaymentType.DAILY ? 'Pase Diario' : (p.isRecurring ? 'Plan Recurrente' : 'Plan Mensual')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-400 text-sm tracking-tighter">{p.amount.toLocaleString()} XAF</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{p.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-xl text-red-400"><Bell size={20} /></div>
                Alertas Críticas
              </h3>
              {totalAlerts > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse shadow-lg shadow-red-500/30">
                  {totalAlerts}
                </span>
              )}
            </div>
            <div className="space-y-4 relative z-10">
              {stats.expiringSoonMembers.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} /> Vencen Pronto (Próx. 7 días)
                  </p>
                  {stats.expiringSoonMembers.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl group hover:bg-amber-500/10 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden">
                          {m.profileImage ? <img src={m.profileImage} className="w-full h-full object-cover" /> : <UserIcon size={14} className="text-amber-500" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">{m.name}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase">{m.nextBillingDate}</p>
                        </div>
                      </div>
                      <Link to="/members" className="text-slate-500 hover:text-white transition-colors">
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {stats.pendingPaymentMembers.length > 0 && (
                <div className="space-y-3 pt-2">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle size={12} /> Pagos Atrasados
                  </p>
                  {stats.pendingPaymentMembers.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-2xl group hover:bg-red-500/10 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden">
                          {m.profileImage ? <img src={m.profileImage} className="w-full h-full object-cover" /> : <UserIcon size={14} className="text-red-500" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">{m.name}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase">Venció: {m.nextBillingDate}</p>
                        </div>
                      </div>
                      <Link to="/payments" className="bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-1.5 rounded-lg transition-all">
                        <CreditCard size={12} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {totalAlerts === 0 && (
                <div className="py-10 text-center space-y-3">
                  <div className="inline-flex p-3 bg-emerald-500/10 rounded-full text-emerald-400">
                    <CheckCircle2 size={32} />
                  </div>
                  <p className="text-xs font-bold text-slate-500">Todo al día. No hay alertas pendientes.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div>
            <h3 className="text-2xl font-black text-white flex items-center gap-4">
              <div className="p-2.5 bg-cyan-500/10 rounded-2xl text-cyan-400"><BarChart3 size={24} /></div>
              Analytics de Rendimiento
            </h3>
            <p className="text-slate-400 text-sm mt-1">Comparativa estratégica de ingresos brutos.</p>
          </div>
          <div className="flex gap-2 p-1.5 bg-slate-900/80 rounded-[1.25rem] border border-slate-700/50 shadow-inner">
            <button onClick={() => setReportType('mensual')} className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 ${reportType === 'mensual' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}>Mensual</button>
            <button onClick={() => setReportType('anual')} className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 ${reportType === 'anual' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}>Anual</button>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentReportData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800 }} />
              <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800 }} tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip cursor={{ fill: 'rgba(51, 65, 85, 0.2)', radius: 12 }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '20px', padding: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#10b981', fontWeight: '900', fontSize: '14px' }} formatter={(value: number) => [`${value.toLocaleString()} XAF`, 'Ingresos']} />
              <Bar dataKey="total" radius={[12, 12, 4, 4]} animationDuration={2000} barSize={reportType === 'mensual' ? 40 : 80}>
                {currentReportData.map((entry, index) => <Cell key={`cell-${index}`} fill={index === currentReportData.length - 1 ? '#10b981' : '#0891b2'} fillOpacity={0.9} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const MembersView = ({ members, setMembers, onUpdateMember }: { members: Member[], setMembers: React.Dispatch<React.SetStateAction<Member[]>>, onUpdateMember: (m: Member) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Directorio de Miembros</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Gestiona y monitorea a todos los atletas del gimnasio.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
            <input type="text" placeholder="Buscar por nombre o email..." className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full md:w-80 transition-all shadow-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="bg-gradient-to-br from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-white p-3.5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95"><Plus size={24} /></button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredMembers.map((m) => (
          <div key={m.id} className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-[2rem] p-8 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 group relative overflow-hidden">
            <div className={`absolute bottom-0 left-0 h-1.5 w-full transition-all duration-500 ${m.plan === 'Premium' ? 'bg-cyan-500' : 'bg-slate-700'}`} />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-all duration-500" />
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-500 shadow-2xl overflow-hidden">
                {m.profileImage ? <img src={m.profileImage} alt={m.name} className="w-full h-full object-cover" /> : <UserIcon size={28} />}
              </div>
              <span className={`px-4 py-1.5 rounded-2xl text-[9px] font-black tracking-[0.2em] uppercase transition-all duration-300 border ${m.status === MemberStatus.ACTIVE ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{m.status}</span>
            </div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors tracking-tight truncate">{m.name}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold"><Mail size={12} /> <span className="truncate">{m.email}</span></div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-700/30 flex justify-between items-center relative z-10">
              <div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Membresía</p>
                <p className={`text-sm font-black ${m.plan === 'Premium' ? 'text-cyan-400' : 'text-slate-400'}`}>{m.plan}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingMember(m)} className="p-3 rounded-2xl bg-slate-700/30 text-slate-400 hover:text-white transition-all"><Edit2 size={16} /></button>
                <button onClick={() => setSelectedMember(m)} className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"><ChevronRight size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedMember && <MemberDetailsModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
      {editingMember && <EditMemberModal member={editingMember} onClose={() => setEditingMember(null)} onSave={(u) => { onUpdateMember(u); setEditingMember(null); }} />}
    </div>
  );
};

const PaymentsView = ({ payments, members, onAddPayment, onUpdatePayment }: { payments: Payment[], members: Member[], onAddPayment: (p: Omit<Payment, 'id'>) => void, onUpdatePayment: (p: Payment) => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState({ memberId: '', amount: 0, type: PaymentType.MONTHLY, visitorName: '', isRecurring: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find(m => m.id === formData.memberId);
    onAddPayment({
      memberId: formData.type === PaymentType.DAILY ? null : formData.memberId,
      memberName: formData.type === PaymentType.DAILY ? formData.visitorName : (member?.name || 'Unknown'),
      amount: formData.amount,
      date: new Date().toISOString().split('T')[0],
      type: formData.type,
      isRecurring: formData.type === PaymentType.MONTHLY && formData.isRecurring
    });
    setIsModalOpen(false);
    setFormData({ memberId: '', amount: 0, type: PaymentType.MONTHLY, visitorName: '', isRecurring: false });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div><h2 className="text-3xl font-black text-white tracking-tight">Tesorería y Cobros</h2><p className="text-slate-500 text-sm mt-1 font-medium">Control total de ingresos y planes.</p></div>
        <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white flex items-center gap-3 px-8 py-4 rounded-[1.5rem] shadow-2xl font-black text-sm uppercase tracking-widest"><Plus size={24} /> Registrar Cobro</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {payments.map((p) => (
          <div key={p.id} className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-1.5 ${p.type === PaymentType.DAILY ? 'bg-orange-500' : 'bg-emerald-500'}`} />
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${p.type === PaymentType.DAILY ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{p.isRecurring ? <RefreshCw size={22} className="animate-spin-slow" /> : <CreditCard size={22} />}</div>
                <div><p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-0.5">{p.type === PaymentType.DAILY ? 'Ticket Diario' : 'Membresía'}</p><h4 className="text-lg font-black text-white truncate max-w-[140px] tracking-tight">{p.memberName}</h4></div>
              </div>
              <button onClick={() => setEditingPayment(p)} className="p-2.5 rounded-xl bg-slate-900/50 text-slate-500 hover:text-emerald-400 transition-all"><Edit2 size={14} /></button>
            </div>
            <div className="mt-8 flex items-end justify-between">
              <div><p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Monto</p><p className="text-2xl font-black text-emerald-400 tracking-tighter">{p.amount.toLocaleString()} XAF</p></div>
              <div className="bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-700/50 text-[10px] font-black text-slate-400 uppercase">{p.date}</div>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[60] flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700/50 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10"><h3 className="text-2xl font-black text-white tracking-tight">Registro Contable</h3><button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-2xl hover:bg-slate-700 transition-all"><X size={24} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setFormData({ ...formData, type: PaymentType.MONTHLY })} className={`p-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${formData.type === PaymentType.MONTHLY ? 'bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-500/20' : 'bg-slate-900/50 border-slate-700 text-slate-500'}`}>Membresía</button>
                <button type="button" onClick={() => setFormData({ ...formData, type: PaymentType.DAILY, isRecurring: false })} className={`p-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${formData.type === PaymentType.DAILY ? 'bg-orange-500 border-orange-400 text-white shadow-xl shadow-orange-500/20' : 'bg-slate-900/50 border-slate-700 text-slate-500'}`}>Pase Diario</button>
              </div>
              {formData.type === PaymentType.MONTHLY ? (
                <>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white font-bold focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.memberId} onChange={(e) => setFormData({ ...formData, memberId: e.target.value })} required>
                    <option value="">Seleccionar atleta...</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  
                  {/* Toggle Recurrente */}
                  <div 
                    onClick={() => setFormData({ ...formData, isRecurring: !formData.isRecurring })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${formData.isRecurring ? 'bg-emerald-500/10 border-emerald-500/40 shadow-xl shadow-emerald-500/5' : 'bg-slate-900 border-slate-700'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-colors ${formData.isRecurring ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        <RefreshCw size={18} className={formData.isRecurring ? 'animate-spin-slow' : ''} />
                      </div>
                      <div>
                        <p className={`text-xs font-black uppercase tracking-tight ${formData.isRecurring ? 'text-emerald-400' : 'text-slate-300'}`}>Suscripción Recurrente</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Renovación automática</p>
                      </div>
                    </div>
                    <div className={`w-10 h-5 rounded-full p-1 transition-all duration-300 flex items-center ${formData.isRecurring ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-md transform ${formData.isRecurring ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </div>
                </>
              ) : (
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white font-bold focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Nombre Visitante" value={formData.visitorName} onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })} required />
              )}
              <div className="relative">
                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-3xl py-5 pl-6 pr-14 text-white text-2xl font-black focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} required placeholder="Monto" />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-black text-xs">XAF</span>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black py-5 rounded-3xl transition-all shadow-2xl shadow-emerald-500/20 active:scale-95 text-sm uppercase tracking-[0.2em]">Validar Operación</button>
            </form>
          </div>
        </div>
      )}
      {editingPayment && <EditPaymentModal payment={editingPayment} onClose={() => setEditingPayment(null)} onSave={(up) => { onUpdatePayment(up); setEditingPayment(null); }} />}
    </div>
  );
};

const CalendarView = ({ events }: { events: GymEvent[] }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <h2 className="text-3xl font-black text-white tracking-tight">Agenda de Clases</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {events.map((event) => (
        <div key={event.id} className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-[2rem] flex gap-5 transition-all duration-500 hover:translate-y-[-8px] group cursor-pointer relative overflow-hidden">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4 rounded-[1.5rem] min-w-[85px] border border-slate-700/50">
            <span className="text-[10px] text-slate-500 uppercase font-black mb-1">{new Date(event.date).toLocaleString('es-ES', { weekday: 'short' })}</span>
            <span className="text-3xl font-black text-emerald-400">{new Date(event.date).getDate()}</span>
          </div>
          <div className="flex-1 py-1">
            <h4 className="font-black text-white text-lg tracking-tight group-hover:text-emerald-400 transition-colors">{event.title}</h4>
            <p className="text-[10px] font-black text-slate-500 uppercase">{event.category}</p>
            <div className="flex items-center justify-between mt-6">
              <span className="text-[10px] text-emerald-400/80 font-black uppercase bg-emerald-500/10 px-3 py-1.5 rounded-full">{event.instructor}</span>
              <span className="text-[10px] font-black text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-full">{event.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [events] = useState<GymEvent[]>(INITIAL_EVENTS);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const lastAlertCount = useRef(0);

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
    return { totalMembers: members.length, activeMembers: members.filter(m => m.status === MemberStatus.ACTIVE).length, monthlyRevenue, dailyRevenue, recentPayments: payments.slice(-10).reverse(), pendingPaymentMembers, expiringSoonMembers };
  }, [members, payments]);

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') return;
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  useEffect(() => {
    const totalAlerts = stats.pendingPaymentMembers.length + stats.expiringSoonMembers.length;
    if (notificationPermission === 'granted' && totalAlerts > 0 && totalAlerts !== lastAlertCount.current) {
      const title = stats.pendingPaymentMembers.length > 0 ? '⚠️ Pagos Pendientes' : '🔔 Vencimientos Próximos';
      const body = `${stats.pendingPaymentMembers.length} pagos atrasados y ${stats.expiringSoonMembers.length} por vencer.`;
      new Notification(title, { body, icon: 'https://cdn-icons-png.flaticon.com/512/1032/1032989.png' });
      lastAlertCount.current = totalAlerts;
    }
  }, [stats, notificationPermission]);

  const handleAddPayment = (p: Omit<Payment, 'id'>) => {
    setPayments(prev => [...prev, { ...p, id: `p${Date.now()}` }]);
    if (p.memberId && p.type === PaymentType.MONTHLY) {
      setMembers(prev => prev.map(m => {
        if (m.id === p.memberId) {
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          return { ...m, lastPaymentDate: p.date, status: MemberStatus.ACTIVE, isRecurring: p.isRecurring, nextBillingDate: p.isRecurring ? nextMonth.toISOString().split('T')[0] : m.nextBillingDate };
        }
        return m;
      }));
    }
  };

  const handleAskAi = async () => {
    setIsAiLoading(true);
    const response = await getGymInsights(stats, "¿Cómo ves el rendimiento y qué recomiendas para los pagos pendientes?");
    setAiResponse(response);
    setIsAiLoading(false);
  };

  const totalAlerts = stats.pendingPaymentMembers.length + stats.expiringSoonMembers.length;

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-950 flex text-slate-200 overflow-x-hidden selection:bg-emerald-500 selection:text-white">
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 lg:ml-72 p-6 md:p-12 pb-32 lg:pb-12 relative z-10 max-w-7xl mx-auto w-full">
          <header className="flex items-center justify-between mb-12">
            <button className="lg:hidden p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white shadow-xl" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
            <div className="flex-1 lg:flex-none" />
            <div className="flex items-center gap-5">
              <button 
                onClick={requestNotificationPermission}
                className={`p-4 rounded-[1.5rem] border backdrop-blur-md transition-all duration-300 relative shadow-xl active:scale-95 group ${notificationPermission === 'granted' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800/80 border-slate-700/50 text-slate-500'}`}
                title={notificationPermission === 'granted' ? 'Notificaciones activas' : 'Habilitar notificaciones'}
              >
                {notificationPermission === 'granted' ? <Bell size={18} className={totalAlerts > 0 ? 'animate-bounce' : ''} /> : <BellOff size={18} />}
                {totalAlerts > 0 && notificationPermission === 'granted' && <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />}
              </button>

              <button onClick={handleAskAi} className="bg-slate-800/80 backdrop-blur-md hover:bg-slate-700 text-emerald-400 p-4 rounded-[1.5rem] border border-slate-700/50 transition-all duration-300 flex items-center gap-3 shadow-xl active:scale-95 group">
                <div className="bg-emerald-500/10 p-1.5 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-all"><MessageSquare size={18} /></div>
                <span className="hidden md:inline font-black text-xs uppercase tracking-widest">IA Manager</span>
              </button>
              <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-emerald-400 via-emerald-500 to-cyan-500 border-2 border-slate-800 shadow-2xl" />
            </div>
          </header>

          {aiResponse && (
            <div className="mb-12 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 p-8 rounded-[2.5rem] animate-in slide-in-from-top-4 relative shadow-2xl">
              <button onClick={() => setAiResponse(null)} className="absolute top-6 right-6 text-emerald-400/50 hover:text-emerald-400 p-2 rounded-xl transition-all"><X size={18} /></button>
              <div className="flex gap-6 items-start">
                <div className="p-4 bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-500/30"><TrendingUp className="text-white" size={24} /></div>
                <div className="flex-1"><h3 className="text-emerald-400 font-black text-xs uppercase tracking-[0.2em] mb-3">Auditoría Inteligente Gemini</h3><p className="text-slate-200 leading-relaxed font-medium text-sm italic">"{aiResponse}"</p></div>
              </div>
            </div>
          )}

          <Routes>
            <Route path="/" element={<DashboardView stats={stats} />} />
            <Route path="/members" element={<MembersView members={members} setMembers={setMembers} onUpdateMember={(u) => setMembers(prev => prev.map(m => m.id === u.id ? u : m))} />} />
            <Route path="/payments" element={<PaymentsView payments={payments} members={members} onAddPayment={handleAddPayment} onUpdatePayment={(u) => setPayments(prev => prev.map(p => p.id === u.id ? u : p))} />} />
            <Route path="/calendar" element={<CalendarView events={events} />} />
          </Routes>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 flex justify-around p-4 lg:hidden z-50">
          {[
            { to: '/', icon: LayoutDashboard, label: 'Panel' },
            { to: '/members', icon: Users, label: 'Miembros' },
            { to: '/payments', icon: CreditCard, label: 'Pagos' },
            { to: '/calendar', icon: CalendarIcon, label: 'Agenda' }
          ].map((tab) => (
            <Link key={tab.to} to={tab.to} className={`flex flex-col items-center p-3 rounded-2xl transition-all ${location.pathname === tab.to ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500'}`}>
              <tab.icon size={22} /><span className="text-[10px] mt-2 font-black uppercase tracking-widest">{tab.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </HashRouter>
  );
}
