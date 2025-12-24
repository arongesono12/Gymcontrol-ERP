import React from 'react';
import logoGym from '../features/images/logo-Gym.png';

interface LogoProps {
  className?: string;
  showText?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-20 h-20", showText = true, light = false }) => (
  <div className={`flex flex-col items-center ${className}`}>
    <div className={`relative ${light ? 'bg-white/10 backdrop-blur-md' : 'bg-white'} rounded-full p-2 shadow-2xl overflow-hidden mb-4 border-4 border-slate-800 transition-transform duration-300 hover:scale-105`}>
      <div className="w-24 h-24 flex items-center justify-center bg-black text-white rounded-full overflow-hidden">
         <img 
           src={logoGym} 
           alt="GymControl Logo" 
           className="w-full h-full object-cover transform scale-110"
         />
      </div>
    </div>
    {showText && (
      <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-700">
        <h1 className={`text-2xl font-black tracking-tighter ${light ? 'text-white' : 'text-slate-900'} leading-none`}>GYMCONTROL</h1>
        <p className={`text-[8px] font-black uppercase tracking-[0.3em] ${light ? 'text-emerald-400' : 'text-slate-500'} mt-1`}>Work Hard & Play Smart</p>
      </div>
    )}
  </div>
);
