import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft, Play } from 'lucide-react';

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

  const handleWorkoutChange = (direction: 'prev' | 'next') => {
      if(!activeWorkoutId) return;
      const currentIndex = workouts.findIndex(w => w.id === activeWorkoutId);
      if(direction === 'next' && currentIndex < workouts.length - 1) {
          setActiveWorkoutId(workouts[currentIndex + 1].id);
          setTime(0);
          setProgress({});
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
      <div className="sticky top-0 z-30 bg-[#110505]/95 backdrop-blur-sm pt-2 pb-2 px-4 shadow-xl border-b border-zinc-900">
        <div className="flex items-center justify-between mb-1">
            <button onClick={onBack} className="text-zinc-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{activeWorkout?.title || 'TREINO'}</p>
                <h1 className="text-2xl font-black text-red-600 font-mono leading-none">
                    {formatTime(time)}
                </h1>
            </div>
            <div className="w-5"></div>
        </div>

        {/* Workout Navigation */}
        <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 px-1">
             <button 
                onClick={() => handleWorkoutChange('prev')}
                disabled={workouts.findIndex(w => w.id === activeWorkoutId) === 0}
                className="flex items-center gap-1 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
             >
                <ChevronLeft className="w-3 h-3" /> ANTERIOR
             </button>
             
             <button 
                onClick={() => handleWorkoutChange('next')}
                disabled={workouts.findIndex(w => w.id === activeWorkoutId) === workouts.length - 1}
                className="flex items-center gap-1 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
             >
                PRÓXIMO <ChevronRight className="w-3 h-3" />
             </button>
        </div>
      </div>

      <div className="px-2 pt-2 space-y-2">
        {activeWorkout ? (
            activeWorkout.exercises.map((exercise, index) => {
                const totalSets = parseInt(exercise.sets) || 3;
                const completedCount = progress[exercise.id]?.length || 0;
                const isComplete = completedCount >= totalSets;
                
                const thumbUrl = `https://source.unsplash.com/random/100x100/?gym,fitness,${index}`;

                return (
                    <div 
                        key={exercise.id} 
                        className={`
                            bg-[#e5e5e5] rounded-md shadow-sm overflow-hidden relative flex items-center p-2 gap-3 transition-all duration-300
                            ${isComplete ? 'border-l-4 border-l-green-600 pl-1' : 'border-l-4 border-l-transparent'}
                        `}
                    >
                        {/* 1. Miniature Image */}
                        <div className="w-10 h-10 rounded bg-zinc-300 flex-shrink-0 relative overflow-hidden">
                            <img src={thumbUrl} alt="" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="w-3 h-3 text-white fill-white" />
                            </div>
                        </div>

                        {/* 2. Text Info (Title + Details) */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-black font-black text-xs uppercase leading-tight truncate">
                                {index + 1}. {exercise.name}
                            </h3>
                            <div className="flex flex-wrap gap-x-2 text-[10px] text-zinc-600 font-medium mt-0.5 leading-tight">
                                <span><strong className="text-black">{exercise.reps}</strong> reps</span>
                                {exercise.load && (
                                    <span className="flex items-center gap-0.5">
                                        • <strong className="text-black">{exercise.load.replace(/\D/g,'')}kg</strong>
                                    </span>
                                )}
                                {exercise.rest && <span className="text-zinc-500">• {exercise.rest}</span>}
                            </div>
                        </div>

                        {/* 3. Interactive Set Bubbles (Horizontal Row) */}
                        <div className="flex gap-1 flex-shrink-0">
                            {Array.from({ length: totalSets }).map((_, i) => {
                                const setNum = i + 1;
                                const isSetDone = progress[exercise.id]?.includes(setNum);
                                return (
                                    <button 
                                        key={i}
                                        onClick={() => toggleSet(exercise.id, setNum)}
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all active:scale-90
                                            ${isSetDone 
                                                ? 'bg-zinc-800 text-white border-zinc-900 shadow-inner' 
                                                : 'bg-white text-zinc-400 border-zinc-300 shadow-sm'}
                                        `}
                                    >
                                        {setNum}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })
        ) : (
            <div className="text-white text-center text-sm py-10">Nenhum treino selecionado.</div>
        )}
      </div>
      
      {/* Finish Button Fixed Bottom */}
      <div className="fixed bottom-0 left-0 w-full p-2 bg-[#110505] border-t border-zinc-900 z-40 pb-safe">
          <button 
            onClick={onBack}
            className="w-full bg-[#ce1126] hover:bg-[#a50d1e] active:scale-95 text-white font-black uppercase tracking-widest py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
          >
              <CheckCircle2 className="w-4 h-4" /> Finalizar
          </button>
      </div>

    </div>
  );
};

export default StudentWorkoutsScreen;