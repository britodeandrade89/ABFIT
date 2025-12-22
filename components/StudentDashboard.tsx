import React from 'react';
import { User, ViewState } from '../types';
import { LogOut, Dumbbell, Activity, Bot, Trophy } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: ViewState) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout, onNavigate }) => {
  return (
    <div className="animate-fadeIn pb-10">
      <header className="p-6 flex justify-between items-center bg-gradient-to-b from-black via-black to-transparent sticky top-0 z-20">
        <div>
           <h2 className="text-3xl font-black italic tracking-tighter">
            <span className="text-red-600">AB</span>FIT
           </h2>
        </div>
        <button 
          onClick={onLogout}
          className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-800 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      <div className="px-6">
        <div className="flex items-center gap-5 mb-10 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 backdrop-blur-sm">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 flex items-center justify-center text-white font-black text-xl shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-none">{user.name}</h3>
            <p className="text-xs text-zinc-500 mt-1">Atleta ABFIT</p>
          </div>
        </div>

        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 ml-1">Menu Principal</h3>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => onNavigate('STUDENT_WORKOUTS')}
            className="metal-btn p-6 rounded-2xl flex flex-col items-center justify-center gap-3 h-32 group border border-zinc-800"
          >
            <Dumbbell className="w-8 h-8 text-zinc-500 group-hover:text-white transition-colors" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider group-hover:text-white">Meus Treinos</span>
          </button>

          <button 
            onClick={() => onNavigate('ASSESSMENT_VIEW')}
            className="metal-btn p-6 rounded-2xl flex flex-col items-center justify-center gap-3 h-32 group border border-zinc-800"
          >
            <Activity className="w-8 h-8 text-red-600 group-hover:text-red-500 transition-colors" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider group-hover:text-white">Avaliação</span>
          </button>

          <button 
            onClick={() => onNavigate('GOALS_VIEW')}
            className="metal-btn p-6 rounded-2xl flex flex-col items-center justify-center gap-3 h-32 group border border-zinc-800 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-20">
                <Trophy className="w-16 h-16 text-yellow-600 rotate-12" />
            </div>
            <Trophy className="w-8 h-8 text-yellow-500 group-hover:text-yellow-400 transition-colors relative z-10" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider group-hover:text-white relative z-10">Metas e Conquistas</span>
          </button>

          <button 
            onClick={() => onNavigate('AI_CHAT')}
            className="col-span-1 relative overflow-hidden group p-6 rounded-2xl border border-red-900/30 flex flex-col items-center justify-center gap-3 shadow-[0_0_15px_rgba(220,38,38,0.1)]"
            style={{
              background: 'linear-gradient(180deg, #1f0a0a 0%, #000000 100%)'
            }}
          >
             <div className="absolute inset-0 bg-red-600/10 group-hover:bg-red-600/20 transition-colors"></div>
             <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/40 relative z-10">
                <Bot className="w-4 h-4" />
             </div>
             <div className="text-center relative z-10">
                <span className="block text-[10px] font-black text-white uppercase tracking-wide">Coach IA</span>
             </div>
          </button>
        </div>

        <div className="border-t border-zinc-900 pt-6 mt-4">
          <p className="text-center text-[10px] text-zinc-700 uppercase tracking-widest">Metodologia André Brito</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;