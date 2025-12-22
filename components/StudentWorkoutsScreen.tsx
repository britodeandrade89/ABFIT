import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { ArrowLeft, Play, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

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
  // We store array of booleans. If index is present, it's done.
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
      <div className="sticky top-0 z-30 bg-[#110505] pt-4 pb-6 px-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="text-zinc-400 hover:text-white">
                <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="relative w-full mx-4">
                <div className="bg-black/80 rounded-full border border-zinc-800 h-16 flex items-center justify-center relative overflow-hidden">
                     {/* Red Glow Effect */}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-red-600 blur-sm"></div>
                    
                    <div className="text-center z-10">
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-0.5">{activeWorkout?.title || 'TREINO'}</p>
                        <h1 className="text-4xl font-black text-red-600 tracking-wider font-mono leading-none drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
                            {formatTime(time)}
                        </h1>
                    </div>
                </div>
            </div>
            <div className="w-6"></div> {/* Spacer */}
        </div>

        {/* Workout Navigation */}
        <div className="flex justify-between items-center text-sm font-medium text-zinc-400 px-2">
             <button 
                onClick={() => handleWorkoutChange('prev')}
                disabled={workouts.findIndex(w => w.id === activeWorkoutId) === 0}
                className="flex items-center gap-1 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
             >
                <ChevronLeft className="w-4 h-4" /> Anterior
             </button>
             
             <button 
                onClick={() => handleWorkoutChange('next')}
                disabled={workouts.findIndex(w => w.id === activeWorkoutId) === workouts.length - 1}
                className="flex items-center gap-1 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
             >
                Próximo <ChevronRight className="w-4 h-4" />
             </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {activeWorkout ? (
            activeWorkout.exercises.map((exercise, index) => {
                const totalSets = parseInt(exercise.sets) || 3;
                const completedCount = progress[exercise.id]?.length || 0;
                const isComplete = completedCount >= totalSets;
                
                // Placeholder image based on index/random to match visual
                const thumbUrl = `https://source.unsplash.com/random/100x100/?gym,fitness,${index}`;

                return (
                    <div key={exercise.id} className="bg-[#e5e5e5] rounded-xl shadow-lg overflow-hidden relative">
                         {/* Card Body */}
                         <div className="p-4 relative z-10">
                            
                            {/* Top Row: Image, Title, Switch */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 rounded-lg bg-zinc-300 flex-shrink-0 relative overflow-hidden shadow-inner">
                                    <img src={thumbUrl} alt="" className="w-full h-full object-cover opacity-80 mix-blend-multiply" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                                            <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex-1 pt-1">
                                    <h3 className="text-black font-black text-sm uppercase leading-tight">
                                        {index + 1}. {exercise.name}
                                    </h3>
                                </div>

                                {/* Toggle Switch Visual */}
                                <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${isComplete ? 'bg-red-600' : 'bg-zinc-400'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isComplete ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            {/* Bottom Row: Stats Grid */}
                            <div className="grid grid-cols-3 gap-2">
                                {/* Series Block */}
                                <div className="bg-[#d4d4d8] rounded-lg p-2 flex flex-col items-center justify-center border border-zinc-300/50 shadow-sm">
                                    <span className="text-[9px] font-bold text-zinc-600 uppercase mb-1">Séries</span>
                                    <span className="text-xl font-black text-black leading-none mb-2">{totalSets}</span>
                                    
                                    {/* Interactive Set Bubbles */}
                                    <div className="flex gap-1">
                                        {Array.from({ length: totalSets }).map((_, i) => {
                                            const setNum = i + 1;
                                            const isSetDone = progress[exercise.id]?.includes(setNum);
                                            return (
                                                <button 
                                                    key={i}
                                                    onClick={() => toggleSet(exercise.id, setNum)}
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all
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

                                {/* Reps Block */}
                                <div className="bg-[#d4d4d8] rounded-lg p-2 flex flex-col items-center justify-center border border-zinc-300/50 shadow-sm">
                                    <span className="text-[9px] font-bold text-zinc-600 uppercase mb-1">Reps</span>
                                    <span className="text-2xl font-black text-black">{exercise.reps}</span>
                                </div>

                                {/* Load Block */}
                                <div className="bg-[#d4d4d8] rounded-lg p-2 flex flex-col items-center justify-center border border-zinc-300/50 shadow-sm">
                                    <span className="text-[9px] font-bold text-zinc-600 uppercase mb-1">Carga</span>
                                    <div className="flex items-baseline">
                                        <span className="text-2xl font-black text-black">{exercise.load?.replace(/\D/g,'') || '0'}</span>
                                        <span className="text-[10px] font-bold text-zinc-600 ml-1">kg</span>
                                    </div>
                                </div>
                            </div>

                         </div>

                         {/* Bottom Red Glow/Border */}
                         <div className="h-1 w-2/3 mx-auto bg-red-500/80 rounded-t-full mt-1 blur-[2px]"></div>
                    </div>
                );
            })
        ) : (
            <div className="text-white text-center">Nenhum treino selecionado.</div>
        )}
      </div>
      
      {/* Finish Button Fixed Bottom */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black to-transparent z-40">
          <button 
            onClick={onBack}
            className="w-full bg-[#ce1126] hover:bg-[#a50d1e] active:scale-95 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-2"
          >
              <CheckCircle2 className="w-5 h-5" /> Finalizar Treino
          </button>
      </div>

    </div>
  );
};

export default StudentWorkoutsScreen;