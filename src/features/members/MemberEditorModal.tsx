import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Member, MemberStatus, UserRole } from '../../types';

interface MemberEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: Member | null;
  onSave: (m: Member) => void;
}

export const MemberEditorModal: React.FC<MemberEditorModalProps> = ({ 
  isOpen, 
  onClose, 
  member, 
  onSave 
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
