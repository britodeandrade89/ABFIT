import React, { useState, useEffect, useRef } from 'react';
import { User, ViewState, Student } from '../types';
import { LogOut, Dumbbell, Activity, CalendarDays, Map, Flag, ClipboardList, Brain, Cloud, ChevronLeft, ChevronRight, CheckCircle2, Home, Target, Bell, BellRing, X, Clock } from 'lucide-react';
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
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Reminder State
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderTime, setReminderTime] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [showVisualAlert, setShowVisualAlert] = useState(false);
  const lastNotificationTime = useRef<string | null>(null);

  const studentData = students.find(s => s.id === user.studentId);

  // Initialize reminder state from student data
  useEffect(() => {
    if (studentData?.reminderConfig) {
      setReminderTime(studentData.reminderConfig.time);
      setReminderEnabled(studentData.reminderConfig.enabled);
    }
  }, [studentData]);

  // Weather Fetch
  useEffect(() => {
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
        setWeather({ temp: 30, city: 'RIO DE JANEIRO' });
      }
    };
    fetchWeather();
  }, [user.studentId]);

  // Reminder Logic (Check every minute)
  useEffect(() => {
    const checkReminder = () => {
      if (!reminderEnabled || !reminderTime) return;

      const now = new Date();
      const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      if (currentHHMM === reminderTime && lastNotificationTime.current !== currentHHMM) {
        lastNotificationTime.current = currentHHMM;
        triggerNotification();
        setShowVisualAlert(true);
      }
    };

    const interval = setInterval(checkReminder, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [reminderEnabled, reminderTime]);

  const triggerNotification = () => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification("Hora do Treino! 💪", {
        body: `Fala ${user.name.split(' ')[0]}! Tudo pronto para o treino de hoje? Vamos buscar o resultado!`,
        icon: "https://placehold.co/192x192/991b1b/FFFFFF/png?text=AB",
        tag: "workout-reminder"
      });
    }
  };

  const handleSaveReminder = async () => {
    if (!studentData) return;

    // Request permission if enabling
    if (reminderEnabled && "Notification" in window && Notification.permission !== "granted") {
      await Notification.requestPermission();
    }

    const updatedStudent = {
      ...studentData,
      reminderConfig: {
        enabled: reminderEnabled,
        time: reminderTime
      }
    };

    const updatedStudents = students.map(s => s.id === studentData.id ? updatedStudent : s);
    onUpdateStudents(updatedStudents);
    setShowReminderModal(false);
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const renderCalendar = () => {
    const grid = [];
    for (let i = 0; i < firstDay; i++) {
        grid.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
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

  const renderHome = () => (
    <div className="animate-fadeIn relative">
      <header className="px-6 pt-6 pb-2 flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-black italic tracking-tighter transform -skew-x-6">
            <span className="text-red-600">AB</span>FIT
           </h2>
           <p className="text-[8px] text-white tracking-[0.2em] uppercase mt-[-4px] ml-1">Assessoria em Treinamentos Físicos</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowReminderModal(true)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${reminderEnabled ? 'bg-zinc-800 text-yellow-500 border-yellow-500/30' : 'bg-transparent text-zinc-500 border-zinc-800'}`}
            >
              {reminderEnabled ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            </button>
            <button 
              onClick={onLogout}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <LogOut className="w-6 h-6" />
            </button>
        </div>
      </header>

      {/* Visual Alert when it's time */}
      {showVisualAlert && (
         <div className="mx-6 mt-4 p-4 bg-red-600 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-between animate-bounceIn relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-50 animate-pulse"></div>
            <div className="relative z-10 flex items-center gap-3">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600">
                  <Dumbbell className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="font-black text-white italic uppercase text-sm">Hora do Treino!</h3>
                  <p className="text-white/90 text-xs">Sem desculpas hoje, hein?</p>
               </div>
            </div>
            <button 
                onClick={() => setShowVisualAlert(false)} 
                className="relative z-10 p-2 bg-black/20 rounded-full text-white hover:bg-black/40"
            >
                <X className="w-4 h-4" />
            </button>
         </div>
      )}

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

      <div className="px-4 mb-8">
        <div className="grid grid-cols-4 gap-3">
             <button 
                onClick={() => setActiveTab('WORKOUTS')}
                className="col-span-2 bg-black/50 backdrop-blur-sm border border-red-600/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-red-900/10 transition-colors shadow-lg shadow-red-900/10 h-32"
             >
                <Dumbbell className="w-8 h-8 text-red-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">Ir para Treino</span>
             </button>

             <button 
                onClick={() => onNavigate('ASSESSMENT_VIEW')}
                className="col-span-2 bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 h-32"
             >
                <ClipboardList className="w-8 h-8 text-pink-500" />
                <span className="text-[10px] font-bold uppercase text-zinc-300">Minha Avaliação</span>
             </button>

             <button onClick={() => onNavigate('RUNNING_WORKOUTS')} className="bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 flex flex-col items-center justify-center gap-2 h-24">
                <Activity className="w-6 h-6 text-orange-500" />
                <span className="text-[9px] font-bold uppercase text-zinc-300">Corrida</span>
             </button>
             <button onClick={() => setActiveTab('GOALS')} className="bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 flex flex-col items-center justify-center gap-2 h-24">
                <CalendarDays className="w-6 h-6 text-yellow-500" />
                <span className="text-[9px] font-bold uppercase text-zinc-300">Metas</span>
             </button>
             <button onClick={() => alert('Em breve')} className="bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 flex flex-col items-center justify-center gap-2 h-24">
                <Map className="w-6 h-6 text-green-500" />
                <span className="text-[9px] font-bold uppercase text-zinc-300">Outdoor</span>
             </button>
             <button onClick={() => alert('Em breve')} className="bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 flex flex-col items-center justify-center gap-2 h-24">
                <Flag className="w-6 h-6 text-blue-500" />
                <span className="text-[9px] font-bold uppercase text-zinc-300">Provas</span>
             </button>
        </div>
      </div>

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

      {/* MODAL: Configurar Lembrete */}
      {showReminderModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6 animate-fadeIn">
            <div className="bg-zinc-900 w-full max-w-sm rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-black/40">
                    <h3 className="text-white font-black italic text-lg uppercase flex items-center gap-2">
                        <Bell className="w-5 h-5 text-red-600" /> Lembrete de Treino
                    </h3>
                    <button onClick={() => setShowReminderModal(false)} className="p-1 rounded-full hover:bg-zinc-800">
                        <X className="w-6 h-6 text-zinc-500" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-zinc-300">Ativar Notificações</label>
                        <button 
                            onClick={() => setReminderEnabled(!reminderEnabled)}
                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${reminderEnabled ? 'bg-green-600' : 'bg-zinc-700'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${reminderEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>

                    <div className={`space-y-2 transition-opacity duration-300 ${reminderEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Horário do Lembrete
                        </label>
                        <input 
                            type="time" 
                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                            className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-white text-2xl font-mono focus:border-red-600 outline-none text-center"
                        />
                    </div>

                    <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-800">
                        <p className="text-[10px] text-zinc-400 leading-relaxed">
                            <strong className="text-red-500">Nota:</strong> Se o app estiver fechado, a notificação dependerá das permissões do seu navegador. Mantenha o app aberto ou em segundo plano para garantir o alerta visual.
                        </p>
                    </div>

                    <button 
                        onClick={handleSaveReminder}
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all"
                    >
                        Salvar Configuração
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent text-white">
      
      <main className="pb-20">
        {activeTab === 'HOME' && renderHome()}
        
        {activeTab === 'WORKOUTS' && (
          <div className="animate-fadeIn">
            <StudentWorkoutsScreen 
              studentId={user.studentId} 
              students={students} 
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

      {/* Barra de Navegação Responsiva */}
      <div className="fixed bottom-0 left-0 w-full z-40">
        <div className="w-full md:max-w-4xl mx-auto bg-black/90 backdrop-blur-xl border-t border-zinc-800 pb-safe">
            <div className="grid grid-cols-4 h-16">
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

    </div>
  );
};

export default StudentDashboard;