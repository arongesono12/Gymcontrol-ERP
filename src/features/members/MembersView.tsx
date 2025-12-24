import React, { useState, useRef, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  CalendarDays, 
  CreditCard, 
  Edit2, 
  Trash2, 
  Camera, 
  User as UserIcon 
} from 'lucide-react';
import { Member, MemberStatus, UserRole, Payment } from '../../types';
import { MemberEditorModal } from './MemberEditorModal';
import { PaymentRegistrationModal } from '../payments/PaymentRegistrationModal';

interface MembersViewProps {
  members: Member[];
  onUpdateMember: (m: Member) => void;
  onDeleteMember: (id: string) => void;
  onAddPayment: (p: Omit<Payment, 'id'>) => void;
}

export const MembersView: React.FC<MembersViewProps> = ({ 
  members, 
  onUpdateMember, 
  onDeleteMember,
  onAddPayment 
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
