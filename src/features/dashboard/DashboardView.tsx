import React from 'react';
import { 
  Users, 
  CreditCard, 
  Activity, 
  DollarSign, 
  TrendingUp, 
  Clock 
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
import { DashboardStats } from '../../types';
import { StatCard } from '../../components/StatCard';

interface DashboardViewProps {
  stats: DashboardStats;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ stats }) => {
  const weeklyData = [
    { name: 'Lun', ingresos: 12000 }, 
    { name: 'Mar', ingresos: 21000 }, 
    { name: 'Mie', ingresos: 18000 }, 
    { name: 'Jue', ingresos: 30000 }, 
    { name: 'Vie', ingresos: 45000 }, 
    { name: 'Sab', ingresos: 32000 }, 
    { name: 'Dom', ingresos: 15000 }
  ];

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
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" />
                <YAxis stroke="#475569" />
                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '1rem' }} />
                <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={4} dot={{ fill: '#10b981', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
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
