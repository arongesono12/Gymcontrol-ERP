import React from 'react';
import { Shield, User as UserIcon } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-20 h-20", showText = true, light = false }) => (
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
