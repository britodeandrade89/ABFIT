import React, { useState } from 'react';
import { Student, RunningWorkout } from '../types';
import { ArrowLeft, Clock, MapPin, Flame, Zap, Snowflake, CheckCircle2, Calendar, TrendingUp, X } from 'lucide-react';

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
  
  // Sort by date (oldest pending first, then completed)
  const sortedWorkouts = [...runningWorkouts].sort((a, b) => {
      // First sort by status (pending first)
      if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
      // Then by date
      return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
  });

  const [selectedWorkout, setSelectedWorkout] = useState<RunningWorkout | null>(null);
  const [feedback, setFeedback] = useState({
    distance: '',
    duration: '',
    rpe: 5 // 1-10 scale default moderate
  });

  const openFeedbackModal = (workout: RunningWorkout) => {
    setSelectedWorkout(workout);
    setFeedback({
      distance: workout.targetDistanceNum ? workout.targetDistanceNum.toString() : '',
      duration: workout.targetDurationNum ? workout.targetDurationNum.toString() : '',
      rpe: 5
    });
  };

  const calculatePace = (distKm: number, timeMin: number) => {
    if (distKm <= 0) return '0:00';
    const paceDec = timeMin / distKm;
    const paceMin = Math.floor(paceDec);
    const paceSec = Math.round((paceDec - paceMin) * 60);
    return `${paceMin}:${paceSec < 10 ? '0' : ''}${paceSec} /km`;
  };

  const handleCompleteWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !selectedWorkout) return;

    const actualDist = parseFloat(feedback.distance);
    const actualDur = parseFloat(feedback.duration);
    const rpe = feedback.rpe;

    // 1. Calculate Pace
    const pace = calculatePace(actualDist, actualDur);

    // 2. "AI" Adjustment Logic:
    // Determine the adjustment factor based on RPE
    // RPE 1-3 (Too Easy): Increase next volume by 10%
    // RPE 4-7 (Optimal): Increase next volume by 5% (Standard Progression)
    // RPE 8-10 (Too Hard): Decrease next volume by 5% or Maintain
    let adjustmentFactor = 1.05; // Default 5% increase
    if (rpe <= 3) adjustmentFactor = 1.10;
    if (rpe >= 8) adjustmentFactor = 0.95;

    // 3. Update current workout status
    const updatedWorkouts = runningWorkouts.map(rw => {
      if (rw.id === selectedWorkout.id) {
        return {
          ...rw,
          status: 'completed',
          feedback: {
            rpe,
            actualDistance: actualDist,
            actualDuration: actualDur,
            pace,
            notes: `Volume ajustado para o futuro.`
          }
        } as RunningWorkout;
      }
      return rw;
    });

    // 4. Update FUTURE workouts of the SAME TYPE
    // Find the next workout of this type that is 'pending'
    let adjustedNext = false;
    const finalWorkouts = updatedWorkouts.map(rw => {
        if (!adjustedNext && rw.status === 'pending' && rw.type === selectedWorkout.type && new Date(rw.scheduledDate) > new Date(selectedWorkout.scheduledDate)) {
            
            // Adjust Distance
            const newDistNum = parseFloat((rw.targetDistanceNum * adjustmentFactor).toFixed(1));
            // Adjust Duration (if relevant to the type, usually scale both or one depending on type, simplified here to scale inputs)
            const newDurNum = Math.ceil(rw.targetDurationNum * adjustmentFactor);

            adjustedNext = true; // Only adjust the immediate next one to allow progressive adaptation
            
            return {
                ...rw,
                targetDistanceNum: newDistNum,
                targetDurationNum: newDurNum,
                targetDistance: `${newDistNum}km`,
                targetDuration: `${newDurNum}min`,
                main: `${rw.main} (Carga ajustada +${Math.round((adjustmentFactor - 1)*100)}% pela IA)`
            };
        }
        return rw;
    });

    const updatedStudent = { ...student, runningWorkouts: finalWorkouts };
    const updatedStudents = students.map(s => s.id === studentId ? updatedStudent : s);
    
    onUpdateStudents(updatedStudents);
    setSelectedWorkout(null);
  };

  const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      // Correct for timezone offset if needed, or just use simple string parts
      const day = date.getDate() + 1; // Simple fix for timezone day shift often seen in JS dates from ISO strings at 00:00
      const month = date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
      return { day, month };
  };

  if (!student) return <div>Aluno não encontrado</div>;

  return (
    <div className="animate-fadeIn min-h-screen bg-transparent pb-24 font-sans relative">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#110505]/80 backdrop-blur-md pt-4 pb-4 px-4 shadow-xl border-b border-zinc-800 flex items-center justify-between">
        <button onClick={onBack} className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black italic text-white tracking-widest uppercase">CORRIDA</h1>
        <div className="w-5"></div>
      </div>

      <div className="p-4 space-y-6">
        {sortedWorkouts.length === 0 ? (
            <div className="text-center py-20 text-zinc-600">
                <p>Nenhum treino de corrida agendado.</p>
            </div>
        ) : (
            sortedWorkouts.map(workout => {
                const isCompleted = workout.status === 'completed';
                const dateObj = new Date(workout.scheduledDate);
                const dayStr = dateObj.getUTCDate();
                const monthStr = dateObj.toLocaleString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', '');

                return (
                <div key={workout.id} className={`relative rounded-r-xl overflow-hidden border-l-4 shadow-2xl transition-all backdrop-blur-sm ${isCompleted ? 'bg-zinc-900/60 border-l-green-600 opacity-60' : 'bg-[#1e293b]/70 border-l-orange-500'}`}>
                    <div className="p-5">
                        
                        {/* Header Row */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center justify-center bg-black/40 rounded-lg p-2 min-w-[50px]">
                                    <span className="text-xl font-black text-white leading-none">{dayStr}</span>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase">{monthStr}</span>
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold leading-tight ${isCompleted ? 'text-zinc-400 line-through' : 'text-white'}`}>{workout.title}</h2>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-zinc-300 font-mono">
                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-orange-500" /> {workout.targetDuration}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-orange-500" /> {workout.targetDistance}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {isCompleted ? (
                                <div className="text-right">
                                    <span className="text-green-500 font-bold text-xs uppercase flex items-center gap-1 mb-1">
                                        <CheckCircle2 className="w-4 h-4" /> Feito
                                    </span>
                                    {workout.feedback && (
                                        <p className="text-[10px] text-zinc-500 font-mono">Pace: {workout.feedback.pace}</p>
                                    )}
                                </div>
                            ) : (
                                <button 
                                    onClick={() => openFeedbackModal(workout)}
                                    className="bg-orange-600 hover:bg-orange-500 text-white p-2 rounded-lg shadow-lg shadow-orange-900/40 active:scale-95 transition-all"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <div className="h-px w-full bg-zinc-700/50 mb-5"></div>

                        {/* Sections */}
                        <div className={`space-y-5 ${isCompleted ? 'opacity-50' : ''}`}>
                            {/* Warmup */}
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                                    <Flame className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider mb-1">Aquecimento</p>
                                    <p className="text-sm text-zinc-300 leading-relaxed">{workout.warmup}</p>
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
                                    <p className="text-sm text-zinc-300 leading-relaxed">{workout.cooldown}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )})
        )}
      </div>

      {/* FEEDBACK MODAL */}
      {selectedWorkout && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-zinc-900 w-full max-w-sm rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden mb-4 sm:mb-0">
                <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-black/40">
                    <div>
                        <h3 className="text-white font-black italic text-lg uppercase">Check-in de Treino</h3>
                        <p className="text-xs text-zinc-500">{selectedWorkout.title}</p>
                    </div>
                    <button onClick={() => setSelectedWorkout(null)} className="p-1 rounded-full hover:bg-zinc-800">
                        <X className="w-6 h-6 text-zinc-500" />
                    </button>
                </div>
                
                <form onSubmit={handleCompleteWorkout} className="p-6 space-y-6">
                    
                    {/* Inputs Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Distância (km)
                            </label>
                            <input 
                                type="number" 
                                step="0.01" 
                                required
                                value={feedback.distance}
                                onChange={e => setFeedback({...feedback, distance: e.target.value})}
                                className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-white text-lg font-mono focus:border-orange-500 outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Tempo (min)
                            </label>
                            <input 
                                type="number" 
                                step="1" 
                                required
                                value={feedback.duration}
                                onChange={e => setFeedback({...feedback, duration: e.target.value})}
                                className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-white text-lg font-mono focus:border-orange-500 outline-none"
                                placeholder="00"
                            />
                        </div>
                    </div>

                    {/* RPE Slider */}
                    <div className="space-y-3">
                         <div className="flex justify-between items-end">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Esforço Percebido (RPE)
                            </label>
                            <span className={`text-xl font-black ${
                                feedback.rpe <= 3 ? 'text-green-500' : 
                                feedback.rpe <= 7 ? 'text-yellow-500' : 'text-red-600'
                            }`}>{feedback.rpe}</span>
                         </div>
                         <input 
                            type="range" 
                            min="1" 
                            max="10" 
                            step="1"
                            value={feedback.rpe}
                            onChange={e => setFeedback({...feedback, rpe: parseInt(e.target.value)})}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-600"
                         />
                         <div className="flex justify-between text-[10px] text-zinc-600 font-bold uppercase">
                             <span>Muito Leve</span>
                             <span>Moderado</span>
                             <span>Exaustivo</span>
                         </div>
                    </div>

                    <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-800">
                        <p className="text-[10px] text-zinc-400 leading-relaxed">
                            <strong className="text-orange-500">IA ABFIT:</strong> Com base nesses dados, recalcularei a sobrecarga dos próximos treinos em 5% automaticamente.
                        </p>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 className="w-5 h-5" /> Confirmar Treino
                    </button>

                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default RunningWorkoutsScreen;