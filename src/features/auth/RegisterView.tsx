import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Phone, ArrowLeft } from 'lucide-react';
import { Member, MemberStatus, UserRole } from '../../types';
import { Logo } from '../../components/Logo';

interface RegisterViewProps {
  onRegister: (member: Member) => void;
  onBackToLogin: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const newMember: Member = {
      id: `m-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: UserRole.MEMBER,
      status: MemberStatus.PENDING, // Pending approval or payment
      plan: 'Basic',
      registrationDate: new Date().toISOString().split('T')[0],
      lastPaymentDate: 'N/A'
    };

    onRegister(newMember);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Logo light={true} className="w-24 h-24" showText={false} />
          <h2 className="text-2xl font-black text-white mt-4">NUEVO ATLETA</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Únete a GymControl Enterprise</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-3xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-4">
          
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold text-center animate-shake">{error}</div>}
          
          <div className="space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="text" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-14 pr-5 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="Nombre Completo" />
            </div>
            
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="email" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-14 pr-5 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required placeholder="Correo Electrónico" />
            </div>

            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="tel" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-14 pr-5 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required placeholder="Teléfono" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="password" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-14 pr-5 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required placeholder="Contraseña" />
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="password" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-14 pr-5 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required placeholder="Confirmar" />
              </div>
            </div>
          </div>
          
          <button type="submit" className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-900/20 hover:bg-emerald-400 active:scale-95 transition-all text-xs uppercase tracking-widest mt-4">
            Crear Cuenta
          </button>
          
          <button type="button" onClick={onBackToLogin} className="w-full flex items-center justify-center gap-2 text-slate-500 text-xs font-bold hover:text-white transition-colors mt-4">
             <ArrowLeft size={14} /> Volver al Login
          </button>
        </form>
      </div>
    </div>
  );
};
