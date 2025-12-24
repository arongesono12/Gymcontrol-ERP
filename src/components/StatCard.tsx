import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
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
