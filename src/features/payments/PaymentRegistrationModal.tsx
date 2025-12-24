import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Member, Payment, PaymentType, UserRole } from '../../types';

interface PaymentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  onAddPayment: (p: Omit<Payment, 'id'>) => void;
  initialMemberId?: string;
}

export const PaymentRegistrationModal: React.FC<PaymentRegistrationModalProps> = ({ 
  isOpen, 
  onClose, 
  members, 
  onAddPayment, 
  initialMemberId 
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
