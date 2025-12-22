import React, { useState } from 'react';
import { Student } from '../types';
import { ArrowLeft, Dumbbell, Clock, Activity, CheckCircle2 } from 'lucide-react';

interface StudentWorkoutsScreenProps {
  studentId?: string;
  students: Student[];
  onBack: () => void;
}

const StudentWorkoutsScreen: React.FC<StudentWorkoutsScreenProps> = ({
  studentId,
  students,
  onBack
}) => {
  const student = students.find(s => s.id === studentId);
  const workouts = student?.workouts || [];
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(workouts.length > 0 ? workouts[0].id : null);

  const activeWorkout = workouts.find(w => w.id === activeWorkoutId);

  if (!student) return <div>Aluno não encontrado</div>;

  return (
    <div className="animate-fadeIn min-h-screen bg-black pb-20">
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-zinc-900 p-4 flex items-center justify-between shadow-2xl">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white border border-zinc-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Meus Treinos</h2>
        <div className="w-10"></div>
      </div>

      <div className="p-4">
        {workouts.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
             <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
               <Dumbbell className="w-8 h-8 text-zinc-600" />
             </div>
             <h3 className="text-white font-bold text-lg">Nenhum treino disponível</h3>
             <p className="text-zinc-500 text-sm mt-2 max-w-xs">Seu professor ainda não cadastrou sua ficha de treinos. Aguarde as atualizações.</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="mb-6 overflow-x-auto pb-2">
              <div className="flex gap-2">
                {workouts.map(w => (
                  <button
                    key={w.id}
                    onClick={() => setActiveWorkoutId(w.id)}
                    className={`px-6 py-4 rounded-xl font-bold whitespace-nowrap transition-all border flex flex-col items-center min-w-[100px] ${
                      activeWorkoutId === w.id
                        ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/40'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                    }`}
                  >
                    <span className="text-sm">{w.title}</span>
                    <span className="text-[10px] font-normal opacity-70 mt-1">{w.exercises.length} Exercícios</span>
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {activeWorkout && (
              <div className="space-y-4 animate-fadeIn">
                 <div className="flex items-center gap-2 mb-2 px-1">
                   <div className="w-1 h-4 bg-red-600 rounded-full"></div>
                   <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Ficha Completa</h3>
                 </div>

                 {activeWorkout.exercises.map((exercise, index) => (
                   <div key={exercise.id} className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 opacity-10 font-black text-4xl text-zinc-500 select-none">
                        {index + 1}
                      </div>
                      
                      <h4 className="text-white font-bold text-lg mb-4 pr-8 leading-tight">{exercise.name}</h4>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-black/40 rounded-lg p-2 text-center border border-zinc-800/50">
                          <span className="block text-[10px] text-zinc-500 uppercase font-bold">Séries</span>
                          <span className="text-white font-mono font-bold">{exercise.sets}</span>
                        </div>
                        <div className="bg-black/40 rounded-lg p-2 text-center border border-zinc-800/50">
                          <span className="block text-[10px] text-zinc-500 uppercase font-bold">Reps</span>
                          <span className="text-white font-mono font-bold">{exercise.reps}</span>
                        </div>
                        <div className="bg-black/40 rounded-lg p-2 text-center border border-zinc-800/50">
                          <span className="block text-[10px] text-zinc-500 uppercase font-bold">Carga</span>
                          <span className="text-yellow-500 font-mono font-bold">{exercise.load || '-'}</span>
                        </div>
                      </div>

                      {(exercise.rest || exercise.observation) && (
                        <div className="mt-4 pt-3 border-t border-zinc-800/50 space-y-2">
                           {exercise.rest && (
                             <div className="flex items-center gap-2 text-xs text-blue-400">
                               <Clock className="w-3 h-3" />
                               <span>Descanso: {exercise.rest}</span>
                             </div>
                           )}
                           {exercise.observation && (
                             <div className="flex items-start gap-2 text-xs text-zinc-400 italic bg-zinc-800/30 p-2 rounded-lg">
                               <Activity className="w-3 h-3 mt-0.5 flex-shrink-0" />
                               <span>{exercise.observation}</span>
                             </div>
                           )}
                        </div>
                      )}
                   </div>
                 ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentWorkoutsScreen;