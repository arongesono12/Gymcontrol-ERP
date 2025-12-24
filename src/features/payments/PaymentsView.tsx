import React, { useState } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { Payment } from '../../types';
import { StatCard } from '../../components/StatCard';

interface PaymentsViewProps {
  payments: Payment[];
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({ payments }) => {
  const [filterType, setFilterType] = useState<'ALL' | 'MONTHLY' | 'DAILY'>('ALL');

  const filteredPayments = payments.filter(p => {
    if (filterType === 'ALL') return true;
    return p.type === filterType;
  });

  const totalRevenue = filteredPayments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-10 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Ingresos Totales" value={`${totalRevenue.toLocaleString()} XAF`} icon={CreditCard} color="bg-emerald-600" />
      </div>

      <div className="bg-slate-900/50 p-8 rounded-[2.5rem] shadow-2xl border border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-white flex items-center gap-3"><DollarSign size={20} className="text-emerald-400" /> Historial de Pagos</h3>
          <div className="flex gap-2">
            <button onClick={() => setFilterType('ALL')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${filterType === 'ALL' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-slate-500'}`}>Todos</button>
            <button onClick={() => setFilterType('MONTHLY')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${filterType === 'MONTHLY' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-slate-500'}`}>Mensuales</button>
            <button onClick={() => setFilterType('DAILY')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${filterType === 'DAILY' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-slate-500'}`}>Diarios</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="pb-4 pl-4 font-black uppercase text-xs tracking-wider">Fecha</th>
                <th className="pb-4 font-black uppercase text-xs tracking-wider">Miembro</th>
                <th className="pb-4 font-black uppercase text-xs tracking-wider">Tipo</th>
                <th className="pb-4 pr-4 text-right font-black uppercase text-xs tracking-wider">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredPayments.map(p => (
                <tr key={p.id} className="group hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 pl-4 text-sm text-slate-400 font-bold">{p.date}</td>
                  <td className="py-4 text-sm text-white font-bold">{p.memberName}</td>
                  <td className="py-4 text-xs font-black uppercase tracking-wider text-slate-500">{p.type}</td>
                  <td className="py-4 pr-4 text-right text-sm text-emerald-400 font-black">{p.amount.toLocaleString()} XAF</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
