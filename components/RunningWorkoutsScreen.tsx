import React from 'react';
import { Student } from '../types';
import { ArrowLeft, Clock, MapPin, Flame, Zap, Snowflake, CheckCircle2 } from 'lucide-react';

interface RunningWorkoutsScreenProps {
  studentId: string;
  students: Student[];
  onUpdateStudents: (students: Student[]) => void;
  onBack: () => void;
}

const RunningWorkoutsScreen: React.FC<RunningWorkoutsScreenProps> = ({
  studentId,
  students,
  onUpdateStudents,
  onBack
}) => {
  const student = students.find(s => s.id === studentId);
  const runningWorkouts = student?.runningWorkouts || [];

  const handleToggleComplete = (workoutId: string) => {
    if (!student) return;
    
    const updatedWorkouts = runningWorkouts.map(rw => 
        rw.id === workoutId 
        ? { ...rw, status: rw.status === 'completed' ? 'pending' : 'completed' } as const
        : rw
    );

    const updatedStudent = { ...student, runningWorkouts: updatedWorkouts };
    const updatedStudents = students.map(s => s.id === studentId ? updatedStudent : s);
    onUpdateStudents(updatedStudents);
  };

  if (!student) return <div>Aluno não encontrado</div>;

  return (
    <div className="animate-fadeIn min-h-screen bg-[#110505] pb-24 font-sans">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#110505]/90 backdrop-blur-md pt-4 pb-4 px-4 shadow-xl border-b border-zinc-900 flex items-center justify-between">
        <button onClick={onBack} className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black italic text-white tracking-widest uppercase">CORRIDA</h1>
        <div className="w-5"></div>
      </div>

      <div className="p-4 space-y-6">
        {runningWorkouts.length === 0 ? (
            <div className="text-center py-20 text-zinc-600">
                <p>Nenhum treino de corrida agendado.</p>
            </div>
        ) : (
            runningWorkouts.map(workout => (
                <div key={workout.id} className="relative bg-[#1e293b] rounded-r-xl overflow-hidden border-l-4 border-l-orange-500 shadow-2xl">
                    <div className="p-5">
                        
                        {/* Header Row */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white leading-tight">{workout.title}</h2>
                                <div className="flex items-center gap-4 mt-1 text-sm text-zinc-300 font-mono">
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-orange-500" /> {workout.targetDuration}</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-orange-500" /> {workout.targetDistance}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleToggleComplete(workout.id)}
                                className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-colors
                                    ${workout.status === 'completed' 
                                        ? 'bg-green-600 text-white hover:bg-green-500' 
                                        : 'bg-orange-500 text-black hover:bg-orange-400'}
                                `}
                            >
                                {workout.status === 'completed' ? 'CONCLUÍDO' : 'PENDENTE'}
                            </button>
                        </div>

                        <div className="h-px w-full bg-zinc-700/50 mb-5"></div>

                        {/* Sections */}
                        <div className="space-y-5">
                            {/* Warmup */}
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                                    <Flame className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider mb-1">Aquecimento</p>
                                    <p className="text-sm text-zinc-200 leading-relaxed">{workout.warmup}</p>
                                </div>
                            </div>

                            {/* Main */}
                            <div className="flex gap-4 bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1">Principal</p>
                                    <p className="text-sm text-white leading-relaxed font-medium">{workout.main}</p>
                                </div>
                            </div>

                            {/* Cooldown */}
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                    <Snowflake className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Desaquecimento</p>
                                    <p className="text-sm text-zinc-200 leading-relaxed">{workout.cooldown}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            ))
        )}
      </div>

    </div>
  );
};

export default RunningWorkoutsScreen;