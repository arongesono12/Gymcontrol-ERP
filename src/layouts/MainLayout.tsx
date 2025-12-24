import React, { useState, useRef } from 'react';
import { Menu, MessageSquare, ChevronDown, User as UserIcon, Camera } from 'lucide-react';
import { Member, UserRole, DashboardStats, AppNotification } from '../types';
import { Sidebar } from '../components/Sidebar';
import { NotificationCenter } from '../components/NotificationCenter';
import { getGymInsights } from '../services/geminiService';

interface MainLayoutProps {
  children: React.ReactNode;
  currentUser: Member;
  notifications: AppNotification[];
  stats: DashboardStats;
  onMarkNotificationAsRead: (id: string) => void;
  onClearNotifications: () => void;
  onUpdateUser: (user: Member) => void;
  onLogout: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentUser,
  notifications,
  stats,
  onMarkNotificationAsRead,
  onClearNotifications,
  onUpdateUser,
  onLogout
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpdateUser({ ...currentUser, profileImage: base64 });
        setIsProfileDropdownOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200 selection:bg-emerald-500">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handlePhotoUpload} 
        className="hidden" 
        accept="image/*" 
      />
      
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} role={currentUser.role} />
      
      <main className="flex-1 lg:ml-72 p-6 md:p-12 pb-32 lg:pb-12 max-w-7xl mx-auto w-full relative z-10">
        <header className="flex items-center justify-between mb-12">
          <button className="lg:hidden p-3 bg-slate-900 rounded-2xl border border-slate-800" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
          <div className="flex-1 px-4">
             <div className="hidden lg:block">
                <h1 className="text-sm font-black text-slate-500 uppercase tracking-widest leading-none">Management Center</h1>
                <p className="text-white font-black text-2xl mt-1">GymControl Suite</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             {currentUser.role === UserRole.ADMIN && (
               <button onClick={async () => setAiResponse(await getGymInsights(stats, "¿Estado actual?"))} className="p-4 bg-slate-900/50 rounded-2xl text-emerald-400 border border-slate-800 shadow-lg hover:bg-slate-800 transition-all">
                 <MessageSquare size={18} />
               </button>
             )}
             
             <NotificationCenter 
               notifications={notifications} 
               onMarkAsRead={onMarkNotificationAsRead} 
               onClearAll={onClearNotifications} 
             />

             {/* Profile Dropdown */}
             <div className="relative">
               <button 
                 onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                 className={`flex items-center gap-3 bg-slate-900/80 p-2 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md transition-all hover:bg-slate-800 ${isProfileDropdownOpen ? 'ring-2 ring-emerald-500' : ''}`}
               >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white overflow-hidden shadow-inner border border-white/10 relative group/avatar">
                    {currentUser.profileImage ? (
                      <img src={currentUser.profileImage} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <UserIcon size={18} />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera size={12} className="text-white" />
                    </div>
                  </div>
                  <div className="hidden md:block mr-2 text-left">
                    <p className="text-xs font-black text-white leading-none">{currentUser.name}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{currentUser.role === UserRole.ADMIN ? 'Administrador' : 'Atleta'}</p>
                  </div>
                  <ChevronDown size={14} className={`text-slate-500 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
               </button>

               {isProfileDropdownOpen && (
                 <>
                   <div className="fixed inset-0 z-[100]" onClick={() => setIsProfileDropdownOpen(false)} />
                   <div className="absolute top-16 right-0 w-64 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl z-[101] overflow-hidden animate-in fade-in slide-in-from-top-2">
                     <div className="p-2">
                       <button onClick={() => fileInputRef.current?.click()} className="w-full text-left p-4 rounded-2xl hover:bg-slate-800 text-xs font-bold text-slate-300 transition-all">Cambiar Foto</button>
                       <button onClick={onLogout} className="w-full text-left p-4 rounded-2xl hover:bg-red-500/10 text-xs font-bold text-red-500 transition-all">Cerrar Sesión</button>
                     </div>
                   </div>
                 </>
               )}
             </div>
          </div>
        </header>
        
        {children}
      </main>
    </div>
  );
};
