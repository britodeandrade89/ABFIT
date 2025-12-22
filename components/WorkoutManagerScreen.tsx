import React, { useState } from 'react';
import { Student, Workout, Exercise } from '../types';
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, Dumbbell } from 'lucide-react';

interface WorkoutManagerScreenProps {
  studentId: string;
  students: Student[];
  onUpdateStudents: (students: Student[]) => void;
  onBack: () => void;
}

const WorkoutManagerScreen: React.FC<WorkoutManagerScreenProps> = ({
  studentId,
  students,
  onUpdateStudents,
  onBack
}) => {
  const student = students.find(s => s.id === studentId);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  
  // State for new workout creation
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  const [newWorkoutTitle, setNewWorkoutTitle] = useState('');

  // State for editing/creating exercise
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [exerciseForm, setExerciseForm] = useState<Partial<Exercise>>({});

  if (!student) return <div className="p-10 text-center">Aluno não encontrado</div>;

  const workouts = student.workouts || [];
  const activeWorkout = workouts.find(w => w.id === activeWorkoutId) || workouts[0];

  const handleCreateWorkout = () => {
    if (!newWorkoutTitle) return;
    const newWorkout: Workout = {
      id: Date.now().toString(),
      title: newWorkoutTitle,
      exercises: []
    };
    
    const updatedStudent = {
      ...student,
      workouts: [...workouts, newWorkout]
    };

    const updatedStudents = students.map(s => s.id === studentId ? updatedStudent : s);
    onUpdateStudents(updatedStudents);
    setNewWorkoutTitle('');
    setIsCreatingWorkout(false);
    setActiveWorkoutId(newWorkout.id);
  };

  const handleDeleteWorkout = (id: string) => {
    if(!confirm("Tem certeza que deseja apagar este treino?")) return;
    const updatedStudent = {
      ...student,
      workouts: workouts.filter(w => w.id !== id)
    };
    const updatedStudents = students.map(s => s.id === studentId ? updatedStudent : s);
    onUpdateStudents(updatedStudents);
    if (activeWorkoutId === id) setActiveWorkoutId(null);
  };

  const openExerciseModal = (exercise?: Exercise) => {
    if (exercise) {
      setEditingExercise(exercise);
      setExerciseForm(exercise);
    } else {
      setEditingExercise(null);
      setExerciseForm({});
    }
    setIsExerciseModalOpen(true);
  };

  const handleSaveExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkout || !exerciseForm.name) return;

    let updatedExercises = [...activeWorkout.exercises];

    if (editingExercise) {
      // Edit existing
      updatedExercises = updatedExercises.map(ex => 
        ex.id === editingExercise.id ? { ...ex, ...exerciseForm } as Exercise : ex
      );
    } else {
      // Create new
      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: exerciseForm.name || 'Exercício',
        sets: exerciseForm.sets || '3',
        reps: exerciseForm.reps || '10',
        load: exerciseForm.load || '',
        rest: exerciseForm.rest || '',
        observation: exerciseForm.observation || ''
      };
      updatedExercises.push(newExercise);
    }

    const updatedWorkout = { ...activeWorkout, exercises: updatedExercises };
    const updatedStudent = {
      ...student,
      workouts: workouts.map(w => w.id === activeWorkout.id ? updatedWorkout : w)
    };
    
    const updatedStudents = students.map(s => s.id === studentId ? updatedStudent : s);
    onUpdateStudents(updatedStudents);
    setIsExerciseModalOpen(false);
  };

  const handleDeleteExercise = (exerciseId: string) => {
     if(!activeWorkout || !confirm("Remover exercício?")) return;
     const updatedWorkout = { 
       ...activeWorkout, 
       exercises: activeWorkout.exercises.filter(ex => ex.id !== exerciseId) 
     };
     const updatedStudent = {
      ...student,
      workouts: workouts.map(w => w.id === activeWorkout.id ? updatedWorkout : w)
    };
    const updatedStudents = students.map(s => s.id === studentId ? updatedStudent : s);
    onUpdateStudents(updatedStudents);
  };

  return (
    <div className="animate-fadeIn min-h-screen bg-black pb-20">
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-zinc-900 p-4 flex items-center justify-between shadow-2xl">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white border border-zinc-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
           <p className="text-[10px] text-zinc-500 uppercase tracking-widest text-right">Gestão de Treinos</p>
           <h2 className="text-lg font-black text-white uppercase tracking-wide">{student.nome}</h2>
        </div>
      </div>

      <div className="p-4">
        {/* Workout Selector / Creator */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2">
            {workouts.map(w => (
              <button
                key={w.id}
                onClick={() => setActiveWorkoutId(w.id)}
                className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all border ${
                  (activeWorkoutId === w.id || (!activeWorkoutId && workouts[0].id === w.id))
                    ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/40'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                }`}
              >
                {w.title}
              </button>
            ))}
            <button 
              onClick={() => setIsCreatingWorkout(true)}
              className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isCreatingWorkout && (
          <div className="mb-6 bg-zinc-900 p-4 rounded-xl border border-zinc-800 animate-fadeIn">
            <h4 className="text-white font-bold mb-3">Novo Treino</h4>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ex: Treino C - Pernas" 
                className="flex-1 bg-black border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-red-600"
                value={newWorkoutTitle}
                onChange={e => setNewWorkoutTitle(e.target.value)}
              />
              <button onClick={handleCreateWorkout} className="bg-white text-black font-bold px-4 rounded-lg">Criar</button>
              <button onClick={() => setIsCreatingWorkout(false)} className="text-zinc-500 px-2"><X className="w-5 h-5" /></button>
            </div>
          </div>
        )}

        {/* Active Workout View */}
        {activeWorkout ? (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-white italic">{activeWorkout.title}</h3>
              <button onClick={() => handleDeleteWorkout(activeWorkout.id)} className="text-red-500 hover:text-red-400 text-xs uppercase font-bold tracking-widest flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> Excluir Treino
              </button>
            </div>

            <div className="space-y-3">
              {activeWorkout.exercises.map(exercise => (
                 <div key={exercise.id} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex justify-between items-start group">
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg mb-1">{exercise.name}</h4>
                      <div className="flex flex-wrap gap-4 text-sm text-zinc-400 font-mono">
                         <span className="bg-black/30 px-2 py-1 rounded">Set: <span className="text-white">{exercise.sets}</span></span>
                         <span className="bg-black/30 px-2 py-1 rounded">Rep: <span className="text-white">{exercise.reps}</span></span>
                         {exercise.load && <span className="bg-black/30 px-2 py-1 rounded">Carga: <span className="text-yellow-500">{exercise.load}</span></span>}
                         {exercise.rest && <span className="bg-black/30 px-2 py-1 rounded">Desc: <span className="text-blue-400">{exercise.rest}</span></span>}
                      </div>
                      {exercise.observation && <p className="text-xs text-zinc-500 mt-2 italic border-l-2 border-zinc-700 pl-2">{exercise.observation}</p>}
                    </div>
                    <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openExerciseModal(exercise)} className="p-2 bg-zinc-800 rounded-lg text-blue-500 hover:bg-zinc-700"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteExercise(exercise.id)} className="p-2 bg-zinc-800 rounded-lg text-red-500 hover:bg-zinc-700"><Trash2 className="w-4 h-4" /></button>
                    </div>
                 </div>
              ))}
            </div>

            <button 
              onClick={() => openExerciseModal()}
              className="w-full mt-6 py-4 border border-dashed border-zinc-700 rounded-xl text-zinc-500 font-bold uppercase tracking-widest hover:border-red-600 hover:text-red-500 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Adicionar Exercício
            </button>
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-600">
            <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Selecione ou crie um treino para começar.</p>
          </div>
        )}
      </div>

      {/* Exercise Modal */}
      {isExerciseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-black/50">
               <h3 className="text-white font-bold">{editingExercise ? 'Editar Exercício' : 'Novo Exercício'}</h3>
               <button onClick={() => setIsExerciseModalOpen(false)}><X className="w-5 h-5 text-zinc-500" /></button>
            </div>
            <form onSubmit={handleSaveExercise} className="p-6 space-y-4">
               <div>
                 <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Nome do Exercício</label>
                 <input 
                   className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                   placeholder="Ex: Supino Reto"
                   value={exerciseForm.name || ''}
                   onChange={e => setExerciseForm({...exerciseForm, name: e.target.value})}
                   required 
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Séries</label>
                   <input 
                     className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                     placeholder="Ex: 4"
                     value={exerciseForm.sets || ''}
                     onChange={e => setExerciseForm({...exerciseForm, sets: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Repetições</label>
                   <input 
                     className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                     placeholder="Ex: 10-12"
                     value={exerciseForm.reps || ''}
                     onChange={e => setExerciseForm({...exerciseForm, reps: e.target.value})}
                   />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Carga (kg)</label>
                   <input 
                     className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                     placeholder="Opcional"
                     value={exerciseForm.load || ''}
                     onChange={e => setExerciseForm({...exerciseForm, load: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Descanso</label>
                   <input 
                     className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                     placeholder="Ex: 60s"
                     value={exerciseForm.rest || ''}
                     onChange={e => setExerciseForm({...exerciseForm, rest: e.target.value})}
                   />
                 </div>
               </div>
               <div>
                 <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Observações</label>
                 <textarea 
                   className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:border-red-600 outline-none text-sm"
                   placeholder="Ex: Cadência controlada, foco na excêntrica..."
                   rows={2}
                   value={exerciseForm.observation || ''}
                   onChange={e => setExerciseForm({...exerciseForm, observation: e.target.value})}
                 />
               </div>
               
               <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl uppercase tracking-widest mt-2 flex items-center justify-center gap-2">
                 <Save className="w-5 h-5" /> Salvar
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutManagerScreen;