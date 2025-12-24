import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Member } from '../../types';
import { Logo } from '../../components/Logo';
import { INITIAL_MEMBERS } from '../../constants';

interface LoginViewProps {
  onLogin: (user: Member) => void;
  onSwitchToRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSwitchToRegister }) => {
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
