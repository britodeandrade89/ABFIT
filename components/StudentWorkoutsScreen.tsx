import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { ArrowLeft, Play, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface StudentWorkoutsScreenProps {
  studentId?: string;
  students: Student[];
  initialWorkoutId?: string | null;
  onBack: () => void;
}

const StudentWorkoutsScreen: React.FC<StudentWorkoutsScreenProps> = ({
  studentId,
  students,
  initialWorkoutId,
  onBack
}) => {
  const student = students.find(s => s.id === studentId);
  const workouts = student?.workouts || [];
  
  // Initialize with passed ID or first workout
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(
    initialWorkoutId || (workouts.length > 0 ? workouts[0].id : null)
  );

  // If prop changes (e.g. returning to this view with a different selection), update state
  useEffect(() => {
    if (initialWorkoutId) {
      setActiveWorkoutId(initialWorkoutId);
    }
  }, [initialWorkoutId]);
  
  // Stopwatch State
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Exercise Progress State: { [exerciseId]: [set1Done, set2Done, set3Done] }
  const [progress, setProgress] = useState<Record<string, number[]>>({});

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (seconds: number) => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  const activeWorkout = workouts.find(w => w.id === activeWorkoutId);

  // Toggle a specific set for an exercise
  const toggleSet = (exerciseId: string, setNumber: number) => {
    setProgress(prev => {
      const currentSets = prev[exerciseId] || [];
      const isDone = currentSets.includes(setNumber);
      
      let newSets;
      if (isDone) {
        newSets = currentSets.filter(s => s !== setNumber);
      } else {
        newSets = [...currentSets, setNumber];
      }
      return { ...prev, [exerciseId]: newSets };
    });
  };

  const isExerciseComplete = (exerciseId: string, totalSets: string) => {
    const doneCount = progress[exerciseId]?.length || 0;
    const target = parseInt(totalSets) || 3;
    return doneCount >= target;
  };

  // Helper to switch workouts
  const handleWorkoutChange = (direction: 'prev' | 'next') => {
      if(!activeWorkoutId) return;
      const currentIndex = workouts.findIndex(w => w.id === activeWorkoutId);
      if(direction === 'next' && currentIndex < workouts.length - 1) {
          setActiveWorkoutId(workouts[currentIndex + 1].id);
          setTime(0); // Reset timer on workout switch? Optional.
          setProgress({}); // Reset progress? Optional.
      } else if (direction === 'prev' && currentIndex > 0) {
          setActiveWorkoutId(workouts[currentIndex - 1].id);
          setTime(0);
          setProgress({});
      }
  };

  if (!student) return <div>Aluno não encontrado</div>;

  return (
    <div className="animate-fadeIn min-h-screen bg-[#110505] pb-24 relative">
      
      {/* HEADER / TIMER AREA */}
      <div className="sticky top-0 z-30 bg-[#110505] pt-4 pb-4 px-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
            <button onClick={onBack} className="text-zinc-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="relative w-full mx-4">
                <div className="bg-black/80 rounded-full border border-zinc-800 h-14 flex items-center justify-center relative overflow-hidden">
                     {/* Red Glow Effect */}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-red-600 blur-sm"></div>
                    
                    <div className="text-center z-10">
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mb-0.5">{activeWorkout?.title || 'TREINO'}</p>
                        <h1 className="text-3xl font-black text-red-600 tracking-wider font-mono leading-none drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
                            {formatTime(time)}
                        </h1>
                    </div>
                </div>
            </div>
            <div className="w-5"></div> {/* Spacer */}
        </div>

        {/* Workout Navigation */}
        <div className="flex justify-between items-center text-xs font-medium text-zinc-400 px-2">
             <button 
                onClick={() => handleWorkoutChange('prev')}
                disabled={workouts.findIndex(w => w.id === activeWorkoutId) === 0}
                className="flex items-center gap-1 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
             >
                <ChevronLeft className="w-3 h-3" /> Anterior
             </button>
             
             <button 
                onClick={() => handleWorkoutChange('next')}
                disabled={workouts.findIndex(w => w.id === activeWorkoutId) === workouts.length - 1}
                className="flex items-center gap-1 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
             >
                Próximo <ChevronRight className="w-3 h-3" />
             </button>
        </div>
      </div>

      <div className="px-3 space-y-3">
        {activeWorkout ? (
            activeWorkout.exercises.map((exercise, index) => {
                const totalSets = parseInt(exercise.sets) || 3;
                const completedCount = progress[exercise.id]?.length || 0;
                const isComplete = completedCount >= totalSets;
                
                // Placeholder image based on index/random to match visual
                const thumbUrl = `https://source.unsplash.com/random/100x100/?gym,fitness,${index}`;

                return (
                    <div key={exercise.id} className="bg-[#e5e5e5] rounded-lg shadow-md overflow-hidden relative">
                         {/* Card Body */}
                         <div className="p-3 relative z-10">
                            
                            {/* Top Row: Image, Title, Switch */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-md bg-zinc-300 flex-shrink-0 relative overflow-hidden shadow-inner">
                                    <img src={thumbUrl} alt="" className="w-full h-full object-cover opacity-80 mix-blend-multiply" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                                            <Play className="w-2.5 h-2.5 text-white fill-white ml-0.5" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <h3 className="text-black font-black text-xs uppercase leading-tight line-clamp-2">
                                        {index + 1}. {exercise.name}
                                    </h3>
                                </div>

                                {/* Toggle Switch Visual */}
                                <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 flex-shrink-0 ${isComplete ? 'bg-red-600' : 'bg-zinc-400'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isComplete ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            {/* Bottom Row: Stats Grid - Compact */}
                            <div className="flex gap-2">
                                {/* Series Block (Takes remaining space) */}
                                <div className="flex-1 bg-[#d4d4d8] rounded p-1.5 flex flex-col items-center justify-center border border-zinc-300/50 shadow-sm">
                                    <span className="text-[8px] font-bold text-zinc-600 uppercase mb-1">Séries</span>
                                    {/* Interactive Set Bubbles */}
                                    <div className="flex gap-1">
                                        {Array.from({ length: totalSets }).map((_, i) => {
                                            const setNum = i + 1;
                                            const isSetDone = progress[exercise.id]?.includes(setNum);
                                            return (
                                                <button 
                                                    key={i}
                                                    onClick={() => toggleSet(exercise.id, setNum)}
                                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all
                                                        ${isSetDone 
                                                            ? 'bg-zinc-700 text-white border-zinc-900 shadow-inner' 
                                                            : 'bg-zinc-300 text-zinc-500 border-zinc-400 hover:bg-white'}
                                                    `}
                                                >
                                                    {setNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Reps Block (Fixed Width) */}
                                <div className="w-16 bg-[#d4d4d8] rounded p-1.5 flex flex-col items-center justify-center border border-zinc-300/50 shadow-sm">
                                    <span className="text-[8px] font-bold text-zinc-600 uppercase mb-0.5">Reps</span>
                                    <span className="text-sm font-black text-black">{exercise.reps}</span>
                                </div>

                                {/* Load Block (Fixed Width) */}
                                <div className="w-16 bg-[#d4d4d8] rounded p-1.5 flex flex-col items-center justify-center border border-zinc-300/50 shadow-sm">
                                    <span className="text-[8px] font-bold text-zinc-600 uppercase mb-0.5">Carga</span>
                                    <div className="flex items-baseline">
                                        <span className="text-sm font-black text-black">{exercise.load?.replace(/\D/g,'') || '0'}</span>
                                        <span className="text-[8px] font-bold text-zinc-600 ml-0.5">kg</span>
                                    </div>
                                </div>
                            </div>

                         </div>

                         {/* Bottom Red Glow/Border */}
                         <div className="h-0.5 w-1/2 mx-auto bg-red-500/80 rounded-t-full mt-0.5 blur-[1px]"></div>
                    </div>
                );
            })
        ) : (
            <div className="text-white text-center">Nenhum treino selecionado.</div>
        )}
      </div>
      
      {/* Finish Button Fixed Bottom */}
      <div className="fixed bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black via-black to-transparent z-40">
          <button 
            onClick={onBack}
            className="w-full bg-[#ce1126] hover:bg-[#a50d1e] active:scale-95 text-white font-black uppercase tracking-widest py-3 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-2 text-sm"
          >
              <CheckCircle2 className="w-4 h-4" /> Finalizar Treino
          </button>
      </div>

    </div>
  );
};

export default StudentWorkoutsScreen;