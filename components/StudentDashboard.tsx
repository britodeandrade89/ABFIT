import React, { useState, useEffect } from 'react';
import { User, ViewState, Student } from '../types';
import { getStudents } from '../services/storageService';
import { LogOut, Dumbbell, Activity, CalendarDays, Map, Flag, ClipboardList, Brain, Cloud, ChevronLeft, ChevronRight, CheckCircle2, Home, Target, MessageCircle, PlayCircle } from 'lucide-react';
import StudentWorkoutsScreen from './StudentWorkoutsScreen';
import GoalsAchievementsScreen from './GoalsAchievementsScreen';
import AIChatScreen from './AIChatScreen';

interface StudentDashboardProps {
  user: User;
  students: Student[];
  onUpdateStudents: (students: Student[]) => void;
  onLogout: () => void;
  onNavigate: (view: ViewState) => void;
}

type TabState = 'HOME' | 'WORKOUTS' | 'GOALS' | 'COACH';

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, students, onUpdateStudents, onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabState>('HOME');
  const [weather, setWeather] = useState<{temp: number, city: string} | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  
  // Calendar State (Only used in Home Tab)
  const [currentDate, setCurrentDate] = useState(new Date());

  const studentData = students.find(s => s.id === user.studentId);

  useEffect(() => {
    // Fetch Weather (Rio de Janeiro hardcoded as per request visual)
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-22.9068&longitude=-43.1729&current=temperature_2m&timezone=America%2FSao_Paulo');
        const data = await response.json();
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          city: 'RIO DE JANEIRO'
        });
      } catch (e) {
        console.error("Weather fetch failed", e);
        setWeather({ temp: 30, city: 'RIO DE JANEIRO' }); // Fallback
      }
    };
    fetchWeather();
  }, [user.studentId]);

  // Calendar Logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const renderCalendar = () => {
    const grid = [];
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        grid.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    // Days
    days.forEach(day => {
        const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
        const hasHistory = studentData?.history?.some(h => {
             const hDate = new Date(h.date);
             return hDate.getDate() === day && hDate.getMonth() === currentDate.getMonth();
        });

        grid.push(
            <div 
                key={day} 
                className={`h-10 flex items-center justify-center rounded-lg text-sm font-medium
                    ${isToday ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/50' : 'text-zinc-400'}
                    ${hasHistory && !isToday ? 'bg-green-900/20 text-green-500 border border-green-900/30' : ''}
                `}
            >
                {day}
            </div>
        );
    });
    return grid;
  };

  const handleWorkoutClick = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
    setActiveTab('WORKOUTS');
  };

  const renderHome = () => (
    <div className="animate-fadeIn">
      {/* HEADER */}
      <header className="px-6 pt-6 pb-2 flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-black italic tracking-tighter transform -skew-x-6">
            <span className="text-red-600">AB</span>FIT
           </h2>
           <p className="text-[8px] text-white tracking-[0.2em] uppercase mt-[-4px] ml-1">Assessoria em Treinamentos Físicos</p>
        </div>
        <button 
          onClick={onLogout}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </header>

      {/* PROFILE SECTION */}
      <div className="px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
             <div className="relative">
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-red-600 to-red-900">
                    <img 
                        src={user.photoUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop"} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover border-2 border-black"
                    />
                </div>
             </div>
             <div>
                <h3 className="text-xl font-bold text-white">Olá, {user.name.split(' ')[0]}</h3>
                <p className="text-xs text-zinc-500">Aluno(a) ABFIT</p>
             </div>
        </div>
        <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-white">
                <Cloud className="w-6 h-6 text-zinc-400" />
                <span className="text-3xl font-black">{weather?.temp}°</span>
            </div>
            <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">{weather?.city}</p>
        </div>
      </div>

      {/* ACTION GRID - SPECIFIC WORKOUTS */}
      <div className="px-4 mb-8">
        <div className="mb-4">
           <h3 className="text-sm font-black text-white italic uppercase tracking-wider mb-3 pl-2 border-l-4 border-red-600">Meus Treinos</h3>
           <div className="grid grid-cols-2 gap-3">
              {studentData?.workouts && studentData.workouts.length > 0 ? (
                studentData.workouts.map((workout, index) => (
                    <button 
                        key={workout.id}
                        onClick={() => handleWorkoutClick(workout.id)}
                        className="group relative w-full aspect-square bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col justify-between hover:border-red-600 transition-all active:scale-95 overflow-hidden shadow-lg"
                    >
                        {/* Decorative Background Icon */}
                        <div className="absolute -right-2 -top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Dumbbell className="w-24 h-24 text-white transform rotate-12" />
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors z-10">
                            <span className="font-black text-lg italic">{index + 1}</span>
                        </div>

                        <div className="text-left w-full z-10">
                            <h4 className="text-xl font-black text-white italic uppercase leading-tight mb-1 line-clamp-2">{workout.title}</h4>
                            
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{workout.exercises.length} EXERCÍCIOS</p>
                                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                   <div className="bg-red-600 rounded-full p-1 shadow-lg shadow-red-900/40">
                                      <PlayCircle className="w-4 h-4 fill-white text-white" />
                                   </div>
                                </div>
                            </div>
                        </div>
                    </button>
                ))
              ) : (
                <div className="col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
                    <p className="text-zinc-500 text-sm">Nenhum treino atribuído ainda.</p>
                </div>
              )}
           </div>
        </div>

        {/* Other Shortcuts */}
        <div className="grid grid-cols-4 gap-3">
             <button 
                onClick={() => onNavigate('ASSESSMENT_VIEW')}
                className="col-span-2 bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 h-24 active:scale-95 transition-transform"
             >
                <ClipboardList className="w-8 h-8 text-pink-500" />
                <span className="text-[10px] font-bold uppercase text-zinc-300">Minha Avaliação</span>
             </button>

             {/* Shortcuts */}
             <button onClick={() => onNavigate('RUNNING_WORKOUTS')} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 flex flex-col items-center justify-center gap-2 h-24 active:scale-95 transition-transform">
                <Activity className="w-6 h-6 text-orange-500" />
                <span className="text-[9px] font-bold uppercase text-zinc-300">Corrida</span>
             </button>
             <button onClick={() => setActiveTab('GOALS')} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 flex flex-col items-center justify-center gap-2 h-24 active:scale-95 transition-transform">
                <CalendarDays className="w-6 h-6 text-yellow-500" />
                <span className="text-[9px] font-bold uppercase text-zinc-300">Metas</span>
             </button>
        </div>
      </div>

      {/* CALENDAR SECTION */}
      <div className="px-6 mb-8">
         <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-white">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
             <div className="flex gap-4">
                 <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}><ChevronLeft className="w-5 h-5 text-zinc-500" /></button>
                 <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}><ChevronRight className="w-5 h-5 text-zinc-500" /></button>
             </div>
         </div>
         
         <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['D','S','T','Q','Q','S','S'].map((d, i) => (
                <span key={i} className="text-[10px] font-bold text-zinc-600">{d}</span>
            ))}
         </div>
         <div className="grid grid-cols-7 gap-2">
             {renderCalendar()}
         </div>
      </div>

      {/* HISTORY SECTION */}
      <div className="px-6 pb-24">
         <h3 className="text-lg font-bold text-white mb-4">Histórico Recente</h3>
         <div className="space-y-3">
             {(!studentData?.history || studentData.history.length === 0) ? (
                 <p className="text-zinc-600 text-sm">Nenhum treino registrado recentemente.</p>
             ) : (
                 studentData.history.map(item => (
                     <div key={item.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                         <div className="bg-slate-800 rounded-xl w-12 h-12 flex flex-col items-center justify-center border border-slate-700">
                             <span className="text-[10px] text-zinc-400 font-bold uppercase">DIA</span>
                             <span className="text-lg font-bold text-white leading-none">{new Date(item.date).getDate()}</span>
                         </div>
                         <div className="flex-1">
                             <h4 className="text-white font-bold">{item.workoutTitle}</h4>
                             <div className="flex items-center gap-1 text-green-500">
                                 <CheckCircle2 className="w-3 h-3" />
                                 <span className="text-xs">Concluído</span>
                             </div>
                         </div>
                         <div className="text-right">
                             <p className="text-[10px] text-zinc-500 uppercase font-bold">TEMPO</p>
                             <div className="bg-black/40 border border-zinc-800 px-2 py-1 rounded text-white font-mono text-sm">
                                 {item.duration}
                             </div>
                         </div>
                     </div>
                 ))
             )}
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0505] to-black text-white">
      
      {/* Content Area */}
      <main className="pb-20">
        {activeTab === 'HOME' && renderHome()}
        
        {activeTab === 'WORKOUTS' && (
          <div className="animate-fadeIn">
            <StudentWorkoutsScreen 
              studentId={user.studentId} 
              students={students} 
              initialWorkoutId={selectedWorkoutId}
              onBack={() => setActiveTab('HOME')} 
            />
          </div>
        )}

        {activeTab === 'GOALS' && (
          <div className="animate-fadeIn">
             <GoalsAchievementsScreen 
               studentId={user.studentId}
               students={students}
               onUpdateStudents={onUpdateStudents}
               onBack={() => setActiveTab('HOME')}
             />
          </div>
        )}

        {activeTab === 'COACH' && (
          <div className="animate-fadeIn">
            <AIChatScreen 
              userName={user.name} 
              onBack={() => setActiveTab('HOME')} 
            />
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-xl border-t border-zinc-800 pb-safe z-50">
        <div className="grid grid-cols-4 h-16 max-w-md mx-auto">
          <button 
            onClick={() => setActiveTab('HOME')}
            className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'HOME' ? 'text-red-600' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Home className="w-5 h-5" strokeWidth={activeTab === 'HOME' ? 3 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wide">Início</span>
          </button>

          <button 
            onClick={() => setActiveTab('WORKOUTS')}
            className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'WORKOUTS' ? 'text-red-600' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Dumbbell className="w-5 h-5" strokeWidth={activeTab === 'WORKOUTS' ? 3 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wide">Treinos</span>
          </button>

          <button 
            onClick={() => setActiveTab('GOALS')}
            className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'GOALS' ? 'text-red-600' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Target className="w-5 h-5" strokeWidth={activeTab === 'GOALS' ? 3 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wide">Metas</span>
          </button>

          <button 
            onClick={() => setActiveTab('COACH')}
            className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'COACH' ? 'text-red-600' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Brain className="w-5 h-5" strokeWidth={activeTab === 'COACH' ? 3 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wide">Coach</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default StudentDashboard;