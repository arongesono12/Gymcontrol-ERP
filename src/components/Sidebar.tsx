import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Calendar as CalendarIcon } from 'lucide-react';
import { UserRole } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  role: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle, role }) => {
  const location = useLocation();
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: [UserRole.ADMIN, UserRole.MEMBER] },
    { icon: Users, label: 'Atletas', path: '/members', roles: [UserRole.ADMIN] },
    { icon: CreditCard, label: 'Cobros', path: '/payments', roles: [UserRole.ADMIN] },
    { icon: CalendarIcon, label: 'Agenda', path: '/calendar', roles: [UserRole.ADMIN, UserRole.MEMBER] },
  ];

  return (
    <>
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggle} />
      <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-950 border-r border-slate-900 z-[70] transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="mb-12">
            <Logo light={true} className="w-full flex-row items-center gap-4 !items-start" showText={true} />
          </div>
          <nav className="space-y-2 flex-1">
            {menuItems.filter(item => item.roles.includes(role)).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && toggle()}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:bg-slate-900 hover:text-slate-200'}`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto pt-6 border-t border-slate-900">
             <div className="flex items-center gap-3 text-xs font-bold text-slate-600 mb-4 px-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>GymControl Enterprise v2.5</span>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};
