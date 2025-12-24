import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Member, DAYS_OF_WEEK } from '../../types';

interface CalendarViewProps {
  members: Member[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ members }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Helper to get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);

  const monthName = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Logic to find members scheduled for a specific date
  const getMembersForDate = (date: Date) => {
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
    // Normalize day name (capitalize first letter to match DAYS_OF_WEEK if needed, or loosely match)
    // Spanish locale usually gives lowercase 'lunes', 'martes'. 
    // Our DAYS_OF_WEEK are capitalized.
    const normalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    
    return members.filter(m => 
      m.schedule && m.schedule.includes(normalizedDayName)
    );
  };

  const selectedDateMembers = useMemo(() => {
    if (!selectedDay) return [];
    // Recalculate based on selectedDay which is an ISO string of the date or similar?
    // Let's just store the Date object or simpler.
    return getMembersForDate(new Date(selectedDay));
  }, [selectedDay, members]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <CalendarIcon className="text-emerald-500" size={32} />
            Calendario de Entrenamientos
          </h2>
          <p className="text-slate-400 mt-1">Gestiona los horarios de los atletas</p>
        </div>
        <div className="flex gap-2">
           <button onClick={prevMonth} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
             <ChevronLeft size={24} />
           </button>
           <h3 className="text-xl font-bold text-white min-w-[200px] text-center capitalize">{monthName}</h3>
           <button onClick={nextMonth} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
             <ChevronRight size={24} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-xl">
           <div className="grid grid-cols-7 gap-2 mb-4">
             {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
               <div key={d} className="text-center text-slate-500 font-bold text-sm uppercase">{d}</div>
             ))}
           </div>
           
           <div className="grid grid-cols-7 gap-2">
             {/* Empty slots for start of month (simple approximation for now, fixing offset propertly later if needed) */}
             {Array.from({ length: (daysInMonth[0].getDay() + 6) % 7 }).map((_, i) => (
               <div key={`empty-${i}`} className="aspect-square"></div>
             ))}

             {daysInMonth.map(date => {
                const membersCount = getMembersForDate(date).length;
                const isSelected = selectedDay === date.toISOString();
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <button 
                    key={date.toISOString()}
                    onClick={() => setSelectedDay(date.toISOString())}
                    className={`
                      aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all
                      ${isSelected ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20' : 'bg-slate-950 hover:bg-slate-800 text-slate-300'}
                      ${isToday ? 'border-2 border-emerald-500' : 'border border-slate-800'}
                    `}
                  >
                    <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>{date.getDate()}</span>
                    {membersCount > 0 && (
                      <div className="flex gap-1 mt-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-emerald-100' : 'text-emerald-500'}`}>{membersCount}</span>
                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`}></div>
                      </div>
                    )}
                  </button>
                );
             })}
           </div>
        </div>

        {/* Day Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-xl h-fit">
           <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">
             {selectedDay ? 
               new Date(selectedDay).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) 
               : 'Selecciona un día'}
           </h3>
           
           {selectedDay ? (
             <div className="space-y-4">
               {selectedDateMembers.length > 0 ? (
                 selectedDateMembers.map(member => (
                   <div key={member.id} className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                     <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
                       {member.name.charAt(0)}
                     </div>
                     <div>
                       <div className="text-white font-bold">{member.name}</div>
                       <div className="text-sm text-slate-400">{member.plan}</div>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-10 text-slate-500">
                   No hay atletas programados para este día.
                 </div>
               )}
             </div>
           ) : (
             <div className="text-center py-10 text-slate-500">
               Selecciona un día en el calendario para ver los detalles.
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
