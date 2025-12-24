import React, { useState } from 'react';
import { Bell, BellOff, Check } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  notifications, 
  onMarkAsRead, 
  onClearAll 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`p-4 rounded-2xl border border-slate-800 shadow-lg transition-all relative group ${isOpen ? 'bg-slate-800 text-emerald-400' : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800'}`}
      >
        {unreadCount > 0 ? (
          <>
            <Bell size={18} className="animate-wiggle" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-slate-800 rounded-full" />
          </>
        ) : (
          <BellOff size={18} />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-16 right-0 w-80 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl z-[101] overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-6 bg-slate-950/50 border-b border-slate-800 flex justify-between items-center">
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Notificaciones</h4>
              {notifications.length > 0 && (
                <button onClick={onClearAll} className="text-[10px] font-bold text-slate-500 hover:text-red-400 uppercase transition-colors">Limpiar</button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-5 border-b border-slate-800/50 last:border-0 hover:bg-slate-800 transition-colors flex gap-4 ${n.read ? 'opacity-60' : 'opacity-100'}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      n.type === 'warning' ? 'bg-amber-500' : 
                      n.type === 'error' ? 'bg-red-500' : 
                      n.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className={`text-xs font-black text-white mb-1 ${n.read ? 'line-through opacity-50' : ''}`}>{n.title}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{n.message}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-600">{n.timestamp}</span>
                        {!n.read && (
                          <button 
                            onClick={() => onMarkAsRead(n.id)}
                            className="p-1 bg-emerald-500/10 text-emerald-400 rounded-md hover:bg-emerald-500 hover:text-white transition-all"
                          >
                            <Check size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center flex flex-col items-center gap-3">
                  <BellOff size={32} className="text-slate-800" />
                  <p className="text-slate-500 text-xs font-bold">Sin novedades por ahora.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
