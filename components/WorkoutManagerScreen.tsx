import React, { useState, useEffect } from 'react';
import { Student, Workout, Exercise } from '../types';
import { ArrowLeft, Plus, Save, Trash2, Dumbbell, Brain, Search, PlayCircle } from 'lucide-react';
import { EXERCISE_DATABASE, ExerciseDefinition } from '../data/exerciseDatabase';
import { GoogleGenAI } from "@google/genai";

interface WorkoutManagerScreenProps {
  studentId: string;
  students: Student[];
  onUpdateStudents: (students: Student[]) => void;
  onBack: () => void;
}

const SYSTEM_INSTRUCTION_TRAINER = `
Você é o "Personal Trainer IA da ABFIT". 
PERFIL: Pós-graduado em Treinamento de Força pela UFRJ.
METODOLOGIA: Prática Baseada em Evidências (PBE). Você não segue "bro-science", apenas ciência.
OBJETIVO: Ajudar o professor a montar treinos periodizados e seguros.
QUANDO SUGERIR EXERCÍCIOS: Explique biomecanicamente o porquê. Fale sobre volume, intensidade e descanso.
TOM DE VOZ: Profissional, técnico, mas colega de trabalho. Use termos como "Mestre", "Professor".
Responda de forma sucinta para caber num chat lateral.
`;

const WorkoutManagerScreen: React.FC<WorkoutManagerScreenProps> = ({
  studentId,
  students,
  onUpdateStudents,
  onBack
}) => {
  const student = students.find(s => s.id === studentId);
  const [workouts, setWorkouts] = useState<Workout[]>(student?.workouts || []);
  
  // State for the Workout Editor
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<Workout>({
    id: '',
    title: '',
    description: '',
    exercises: []
  });

  // State for Right Panel (Tools)
  const [activeToolTab, setActiveToolTab] = useState<'DATABASE' | 'AI'>('DATABASE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Peitoral');

  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Olá, Professor! Sou seu assistente especialista em força (UFRJ). Como posso ajudar na periodização hoje?' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (editingWorkoutId) {
      const w = workouts.find(w => w.id === editingWorkoutId);
      if (w) setCurrentWorkout(w);
    } else {
      // New workout template
      setCurrentWorkout({
        id: Date.now().toString(),
        title: 'Novo Treino',
        description: 'Hipertrofia / Força',
        exercises: []
      });
    }
  }, [editingWorkoutId, workouts]);

  const handleSaveWorkout = () => {
    if (!student) return;
    let updatedWorkouts;
    
    if (editingWorkoutId) {
      updatedWorkouts = workouts.map(w => w.id === editingWorkoutId ? currentWorkout : w);
    } else {
      updatedWorkouts = [...workouts, currentWorkout];
    }

    const updatedStudent = { ...student, workouts: updatedWorkouts };
    const updatedStudents = students.map(s => s.id === studentId ? updatedStudent : s);
    
    onUpdateStudents(updatedStudents);
    setWorkouts(updatedWorkouts);
    setEditingWorkoutId(null); // Go back to list
    alert('Treino salvo com sucesso!');
  };

  const handleAddExerciseFromDatabase = (exDef: ExerciseDefinition) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exDef.name,
      sets: '3',
      reps: '10-12',
      load: '0kg',
      rest: '60s',
      observation: ''
    };
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string) => {
    const updatedExercises = [...currentWorkout.exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setCurrentWorkout(prev => ({ ...prev, exercises: updatedExercises }));
  };

  const removeExercise = (index: number) => {
    const updatedExercises = currentWorkout.exercises.filter((_, i) => i !== index);
    setCurrentWorkout(prev => ({ ...prev, exercises: updatedExercises }));
  };

  const deleteWorkout = (workoutId: string) => {
    if(!confirm("Deletar este treino?")) return;
    const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
    if(student) {
        const updatedStudent = { ...student, workouts: updatedWorkouts };
        const updatedStudents = students.map(s => s.id === studentId ? updatedStudent : s);
        onUpdateStudents(updatedStudents);
        setWorkouts(updatedWorkouts);
    }
  };

  const handleAiSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiLoading(true);

    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API Key missing");
        
        const ai = new GoogleGenAI({ apiKey });
        
        const chat = ai.chats.create({
            model: "gemini-3-flash-preview",
            config: {
                systemInstruction: SYSTEM_INSTRUCTION_TRAINER
            },
            history: chatHistory.map(h => ({ role: h.role, parts: [{ text: h.text }] }))
        });

        const result = await chat.sendMessage({ message: userMsg });
        const response = result.text;

        setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
        console.error(error);
        setChatHistory(prev => [...prev, { role: 'model', text: "Erro ao conectar com a IA. Verifique sua chave API." }]);
    } finally {
        setIsAiLoading(false);
    }
  };

  if (!student) return <div>Aluno não encontrado</div>;

  return (
    <div className="animate-fadeIn min-h-screen bg-[#050505] flex flex-col">
      {/* Header */}
      <div className="bg-[#111] p-4 border-b border-zinc-800 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">Editor de Treinos</h1>
            <p className="text-xs text-zinc-500">Aluno: {student.nome}</p>
          </div>
        </div>
        <div className="flex gap-2">
            {workouts.length > 0 && (
                 <select 
                    className="bg-zinc-800 text-xs text-white p-2 rounded-lg outline-none"
                    onChange={(e) => {
                        if(e.target.value === 'new') {
                            setEditingWorkoutId(null);
                            setCurrentWorkout({id: Date.now().toString(), title: 'Novo Treino', exercises: []});
                        } else {
                            setEditingWorkoutId(e.target.value);
                        }
                    }}
                    value={editingWorkoutId || 'new'}
                 >
                    <option value="new">+ Criar Novo</option>
                    {workouts.map(w => <option key={w.id} value={w.id}>{w.title}</option>)}
                 </select>
            )}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT COLUMN: WORKOUT BUILDER */}
        <div className="flex-1 overflow-y-auto p-4 border-r border-zinc-800 custom-scrollbar pb-32">
            <div className="max-w-2xl mx-auto space-y-6">
                
                {/* Workout Metadata */}
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                    <label className="text-xs text-zinc-500 font-bold uppercase block mb-1">Título do Treino</label>
                    <input 
                        type="text" 
                        value={currentWorkout.title}
                        onChange={e => setCurrentWorkout({...currentWorkout, title: e.target.value})}
                        className="w-full bg-transparent text-xl font-bold text-white outline-none placeholder-zinc-700"
                        placeholder="Ex: Treino A - Peitoral"
                    />
                    <input 
                        type="text" 
                        value={currentWorkout.description || ''}
                        onChange={e => setCurrentWorkout({...currentWorkout, description: e.target.value})}
                        className="w-full bg-transparent text-sm text-zinc-400 outline-none mt-2"
                        placeholder="Descrição (Ex: Foco em força máxima)"
                    />
                </div>

                {/* Exercises List */}
                <div className="space-y-4">
                    {currentWorkout.exercises.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-xl">
                            <Dumbbell className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                            <p className="text-zinc-500 text-sm">Seu treino está vazio.</p>
                            <p className="text-zinc-600 text-xs mt-1">Clique nos exercícios à direita para adicionar.</p>
                        </div>
                    ) : (
                        currentWorkout.exercises.map((ex, idx) => (
                            <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-fadeIn group hover:border-zinc-700 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-white text-md flex items-center gap-2">
                                        <span className="text-zinc-600 text-xs">#{idx + 1}</span> {ex.name}
                                    </h4>
                                    <button onClick={() => removeExercise(idx)} className="text-zinc-600 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    <div>
                                        <label className="text-[9px] text-zinc-500 uppercase font-bold">Séries</label>
                                        <input type="text" value={ex.sets} onChange={(e) => updateExercise(idx, 'sets', e.target.value)} className="w-full bg-black/50 border border-zinc-800 rounded p-1 text-xs text-white text-center" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] text-zinc-500 uppercase font-bold">Reps</label>
                                        <input type="text" value={ex.reps} onChange={(e) => updateExercise(idx, 'reps', e.target.value)} className="w-full bg-black/50 border border-zinc-800 rounded p-1 text-xs text-white text-center" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] text-zinc-500 uppercase font-bold">Carga</label>
                                        <input type="text" value={ex.load} onChange={(e) => updateExercise(idx, 'load', e.target.value)} className="w-full bg-black/50 border border-zinc-800 rounded p-1 text-xs text-white text-center" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] text-zinc-500 uppercase font-bold">Descanso</label>
                                        <input type="text" value={ex.rest} onChange={(e) => updateExercise(idx, 'rest', e.target.value)} className="w-full bg-black/50 border border-zinc-800 rounded p-1 text-xs text-white text-center" />
                                    </div>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Observações (opcional)" 
                                    value={ex.observation || ''} 
                                    onChange={(e) => updateExercise(idx, 'observation', e.target.value)}
                                    className="w-full mt-2 bg-transparent text-xs text-zinc-400 placeholder-zinc-700 outline-none border-b border-transparent focus:border-zinc-700 py-1"
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* Save Button */}
                <button 
                    onClick={handleSaveWorkout}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition-all"
                >
                    <Save className="w-5 h-5" /> Salvar Treino
                </button>
                
                {editingWorkoutId && (
                     <button 
                        onClick={() => deleteWorkout(editingWorkoutId)}
                        className="w-full py-3 bg-red-900/20 hover:bg-red-900/40 text-red-500 text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                    >
                        Excluir Treino
                    </button>
                )}
            </div>
        </div>

        {/* RIGHT COLUMN: TOOLS & DATABASE */}
        <div className="w-full md:w-[400px] flex flex-col bg-[#0a0a0a]">
            {/* Tool Tabs */}
            <div className="flex border-b border-zinc-800">
                <button 
                    onClick={() => setActiveToolTab('DATABASE')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${activeToolTab === 'DATABASE' ? 'bg-zinc-800 text-white border-b-2 border-red-600' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Dumbbell className="w-4 h-4" /> Banco de Exercícios
                </button>
                <button 
                    onClick={() => setActiveToolTab('AI')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${activeToolTab === 'AI' ? 'bg-zinc-800 text-blue-400 border-b-2 border-blue-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Brain className="w-4 h-4" /> IA Especialista
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                
                {/* === EXERCISE DATABASE TAB === */}
                {activeToolTab === 'DATABASE' && (
                    <div className="space-y-4">
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            {Object.keys(EXERCISE_DATABASE).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input 
                                type="text" 
                                placeholder="Buscar exercício..." 
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-zinc-600 outline-none"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {EXERCISE_DATABASE[selectedCategory]
                                .filter(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map(ex => (
                                    <button 
                                        key={ex.id}
                                        onClick={() => handleAddExerciseFromDatabase(ex)}
                                        className="group relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-red-600 text-left transition-all active:scale-95"
                                    >
                                        <div className="aspect-video w-full bg-zinc-800 relative">
                                            {/* Representatividade: Imagem do Unsplash */}
                                            <img src={ex.videoUrl} alt={ex.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                                                <Plus className="w-8 h-8 text-white drop-shadow-lg" />
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <p className="text-[10px] font-bold text-zinc-300 leading-tight group-hover:text-white">{ex.name}</p>
                                        </div>
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                )}

                {/* === AI CONSULTANT TAB === */}
                {activeToolTab === 'AI' && (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 space-y-3 mb-4">
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-zinc-800 text-white ml-8' : 'bg-blue-900/20 text-blue-100 mr-8 border border-blue-800/30'}`}>
                                    {msg.role === 'model' && <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Especialista UFRJ</p>}
                                    <p className="leading-relaxed">{msg.text}</p>
                                </div>
                            ))}
                            {isAiLoading && (
                                <div className="text-center text-xs text-zinc-500 animate-pulse">Consultando evidências científicas...</div>
                            )}
                        </div>
                        <div className="flex gap-2 mt-auto">
                            <input 
                                type="text"
                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                                placeholder="Pergunte sobre séries, métodos..."
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAiSend()}
                            />
                            <button 
                                onClick={handleAiSend}
                                disabled={isAiLoading}
                                className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg disabled:opacity-50"
                            >
                                <PlayCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutManagerScreen;