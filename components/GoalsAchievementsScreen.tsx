import React, { useState } from 'react';
import { Student, Goal, Achievement } from '../types';
import { ArrowLeft, Plus, Trophy, Target, Medal, Zap, Crown, Star, CheckCircle, Trash2, Minus, Share2 } from 'lucide-react';

interface GoalsAchievementsScreenProps {
  studentId?: string;
  students: Student[];
  onUpdateStudents: (students: Student[]) => void;
  onBack: () => void;
}

const GoalsAchievementsScreen: React.FC<GoalsAchievementsScreenProps> = ({
  studentId,
  students,
  onUpdateStudents,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'GOALS' | 'ACHIEVEMENTS'>('GOALS');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', unit: '' });

  const student = students.find(s => s.id === studentId);

  if (!student) return <div className="p-10 text-center text-white">Aluno não encontrado</div>;

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.target) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      target: Number(newGoal.target),
      current: 0,
      unit: newGoal.unit || 'x',
      completed: false
    };

    const updatedStudent = { ...student, goals: [...student.goals, goal] };
    const updatedStudents = students.map(s => s.id === studentId ? updatedStudent : s);
    onUpdateStudents(updatedStudents); // Logic for achievements check happens in App wrapper or trigger function
    setNewGoal({ title: '', target: '', unit: '' });
    setShowAddGoal(false);
  };

  const updateGoalProgress = (goalId: string, increment: number) => {
    const updatedGoals = student.goals.map(g => {
      if (g.id === goalId) {
        const newCurrent = Math.max(0, g.current + increment);
        const isCompleted = newCurrent >= g.target;
        return { ...g, current: newCurrent, completed: isCompleted };
      }
      return g;
    });
    
    const updatedStudent = { ...student, goals: updatedGoals };
    const updatedStudents = students.map(s => s.id === studentId ? updatedStudent : s);
    onUpdateStudents(updatedStudents);
  };

  const deleteGoal = (goalId: string) => {
    if(!confirm("Remover esta meta?")) return;
    const updatedGoals = student.goals.filter(g => g.id !== goalId);
    const updatedStudent = { ...student, goals: updatedGoals };
    const updatedStudents = students.map(s => s.id === studentId ? updatedStudent : s);
    onUpdateStudents(updatedStudents);
  };

  const handleShare = async (ach: Achievement) => {
    const text = `🏆 Conquista Desbloqueada na ABFIT: ${ach.title} - ${ach.description} #ABFIT #TreinoSerio`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nova Conquista ABFIT',
          text: text,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Texto copiado para compartilhar!');
    }
  };

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'medal': return <Medal className="w-6 h-6" />;
      case 'zap': return <Zap className="w-6 h-6" />;
      case 'target': return <Target className="w-6 h-6" />;
      case 'crown': return <Crown className="w-6 h-6" />;
      case 'star': return <Star className="w-6 h-6" />;
      default: return <Trophy className="w-6 h-6" />;
    }
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
        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Desafios</h2>
        <div className="w-10"></div>
      </div>

      <div className="p-4">
        <div className="flex bg-zinc-900 p-1 rounded-xl mb-6 border border-zinc-800">
          <button 
            onClick={() => setActiveTab('GOALS')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'GOALS' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Minhas Metas
          </button>
          <button 
            onClick={() => setActiveTab('ACHIEVEMENTS')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'ACHIEVEMENTS' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Conquistas
          </button>
        </div>

        {activeTab === 'GOALS' && (
          <div className="space-y-4 animate-fadeIn">
            {showAddGoal ? (
              <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-4">Criar Nova Meta</h3>
                <form onSubmit={handleAddGoal} className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Ex: Treinar 4x na semana" 
                    className="w-full p-4 rounded-xl bg-black border border-zinc-800 text-white focus:border-red-600 outline-none"
                    value={newGoal.title}
                    onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                    required
                  />
                  <div className="flex gap-4">
                    <input 
                      type="number" 
                      placeholder="Alvo (nº)" 
                      className="flex-1 p-4 rounded-xl bg-black border border-zinc-800 text-white focus:border-red-600 outline-none"
                      value={newGoal.target}
                      onChange={e => setNewGoal({...newGoal, target: e.target.value})}
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="Unid (Ex: dias)" 
                      className="flex-1 p-4 rounded-xl bg-black border border-zinc-800 text-white focus:border-red-600 outline-none"
                      value={newGoal.unit}
                      onChange={e => setNewGoal({...newGoal, unit: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowAddGoal(false)} className="flex-1 py-3 bg-zinc-800 rounded-xl text-zinc-400 font-bold uppercase text-xs">Cancelar</button>
                    <button type="submit" className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold uppercase text-xs hover:bg-red-500 shadow-lg shadow-red-900/20">Criar Meta</button>
                  </div>
                </form>
              </div>
            ) : (
              <button 
                onClick={() => setShowAddGoal(true)}
                className="w-full py-4 border border-dashed border-zinc-700 rounded-2xl text-zinc-500 font-bold uppercase text-xs hover:border-red-600 hover:text-red-500 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Nova Meta
              </button>
            )}

            {student.goals.length === 0 && !showAddGoal && (
               <div className="text-center py-10">
                 <Target className="w-12 h-12 text-zinc-800 mx-auto mb-3" />
                 <p className="text-zinc-600 text-sm">Nenhuma meta definida ainda.</p>
               </div>
            )}

            {student.goals.map(goal => (
              <div key={goal.id} className={`p-5 rounded-2xl border transition-all ${goal.completed ? 'bg-green-900/10 border-green-900/30' : 'bg-zinc-900/50 border-zinc-800'}`}>
                <div className="flex justify-between items-start mb-3">
                  <h4 className={`font-bold ${goal.completed ? 'text-green-500' : 'text-white'}`}>{goal.title}</h4>
                  <button onClick={() => deleteGoal(goal.id)} className="text-zinc-600 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
                
                <div className="flex items-center gap-4">
                   <div className="flex-1">
                      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${goal.completed ? 'bg-green-500' : 'bg-red-600'}`} 
                          style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-zinc-500 mt-2 font-mono">
                        {goal.current} / {goal.target} {goal.unit}
                      </p>
                   </div>
                   
                   <div className="flex items-center gap-2">
                     {goal.completed && (
                       <div className="mr-1 text-green-500 animate-fadeIn">
                         <CheckCircle className="w-5 h-5" />
                       </div>
                     )}
                     <button 
                       onClick={() => updateGoalProgress(goal.id, -1)}
                       className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 active:scale-95 transition-all"
                       disabled={goal.current <= 0}
                     >
                       <Minus className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={() => updateGoalProgress(goal.id, 1)}
                       className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white hover:bg-red-500 shadow-lg shadow-red-900/20 active:scale-95 transition-all"
                     >
                       <Plus className="w-4 h-4" />
                     </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ACHIEVEMENTS' && (
          <div className="grid grid-cols-2 gap-4 animate-fadeIn">
            {student.achievements.map(ach => (
              <div key={ach.id} className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-3 relative overflow-hidden ${ach.unlocked ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-yellow-600/30' : 'bg-zinc-900/30 border-zinc-800 opacity-50 grayscale'}`}>
                {ach.unlocked && <div className="absolute inset-0 bg-yellow-600/5"></div>}
                
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${ach.unlocked ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'bg-zinc-800 text-zinc-600'}`}>
                  {getIcon(ach.icon)}
                </div>
                
                <div className="relative z-10 w-full">
                  <h4 className={`text-sm font-bold leading-tight mb-1 ${ach.unlocked ? 'text-white' : 'text-zinc-500'}`}>{ach.title}</h4>
                  <p className="text-[10px] text-zinc-500 leading-tight mb-3 min-h-[2.5em]">{ach.description}</p>
                  
                  {ach.unlocked && (
                     <button 
                        onClick={() => handleShare(ach)}
                        className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center gap-2 text-[10px] font-bold text-yellow-500 uppercase tracking-widest transition-colors"
                     >
                        <Share2 className="w-3 h-3" /> Compartilhar
                     </button>
                  )}
                </div>

                {ach.unlocked && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsAchievementsScreen;