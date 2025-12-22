import React, { useState } from 'react';
import { Student } from '../types';
import { Plus, Users, Trash2, ChartLine, LogOut, Dumbbell } from 'lucide-react';
import { DEFAULT_ACHIEVEMENTS } from '../services/storageService';

interface ProfessorDashboardProps {
  students: Student[];
  onUpdateStudents: (students: Student[]) => void;
  onLogout: () => void;
  onSelectStudent: (id: string) => void;
  onManageWorkouts?: (id: string) => void;
}

export const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ 
  students, 
  onUpdateStudents, 
  onLogout,
  onSelectStudent,
  onManageWorkouts
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', date: '', gender: 'Masculino' });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const student: Student = {
      id: Date.now().toString(),
      nome: newStudent.name,
      email: newStudent.email.trim().toLowerCase(),
      nascimento: newStudent.date,
      sexo: newStudent.gender,
      avaliacoes: [],
      goals: [],
      workouts: [],
      runningWorkouts: [],
      history: [],
      achievements: DEFAULT_ACHIEVEMENTS.map(a => ({
        ...a, 
        unlocked: a.id === 'welcome', 
        unlockedAt: a.id === 'welcome' ? new Date().toISOString() : undefined
      }))
    };
    onUpdateStudents([...students, student]);
    setShowModal(false);
    setNewStudent({ name: '', email: '', date: '', gender: 'Masculino' });
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este aluno?")) {
      onUpdateStudents(students.filter(s => s.id !== id));
    }
  };

  return (
    <div className="animate-fadeIn min-h-screen pb-20">
      <header className="p-6 flex justify-between items-center bg-black/90 backdrop-blur-md sticky top-0 z-20 border-b border-zinc-900">
        <div>
          <h2 className="text-xl font-bold text-white">Painel do Treinador</h2>
          <p className="text-xs text-zinc-500">Gestão de Alunos</p>
        </div>
        <button 
          onClick={onLogout}
          className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-800"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Lista de Atletas</h3>
          <button 
            onClick={() => setShowModal(true)}
            className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-900/30 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
            <Users className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm font-medium">Nenhum aluno cadastrado.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map(student => (
              <div key={student.id} className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 flex justify-between items-center backdrop-blur-sm">
                <div>
                  <h4 className="text-white font-bold">{student.nome}</h4>
                  <p className="text-xs text-zinc-500">{student.email}</p>
                </div>
                <div className="flex gap-2">
                   {/* Workout Button */}
                   <button 
                    onClick={() => onManageWorkouts && onManageWorkouts(student.id)}
                    className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 text-yellow-500 rounded-lg flex items-center justify-center transition-colors"
                    title="Gerenciar Treinos"
                  >
                    <Dumbbell className="w-4 h-4" />
                  </button>

                  {/* Assessment Button */}
                  <button 
                    onClick={() => onSelectStudent(student.id)}
                    className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 text-blue-500 rounded-lg flex items-center justify-center transition-colors"
                    title="Avaliação Física"
                  >
                    <ChartLine className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDelete(student.id)}
                    className="w-10 h-10 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded-lg flex items-center justify-center transition-colors"
                    title="Remover Aluno"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-6 animate-fadeIn">
            <div className="bg-zinc-900 w-full max-w-sm rounded-3xl p-8 border border-zinc-800 shadow-2xl">
              <h3 className="text-2xl font-black text-white mb-6 italic">NOVO ATLETA</h3>
              <form onSubmit={handleAddStudent} className="space-y-5">
                <input 
                  type="text" 
                  placeholder="Nome Completo" 
                  required
                  className="w-full p-3 rounded-xl bg-black/50 border border-zinc-800 text-white focus:border-blue-600 outline-none transition-colors"
                  value={newStudent.name}
                  onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                />
                <input 
                  type="email" 
                  placeholder="E-mail" 
                  required
                  className="w-full p-3 rounded-xl bg-black/50 border border-zinc-800 text-white focus:border-blue-600 outline-none transition-colors"
                  value={newStudent.email}
                  onChange={e => setNewStudent({...newStudent, email: e.target.value})}
                />
                <input 
                  type="date" 
                  required
                  className="w-full p-3 rounded-xl bg-black/50 border border-zinc-800 text-white focus:border-blue-600 outline-none transition-colors"
                  value={newStudent.date}
                  onChange={e => setNewStudent({...newStudent, date: e.target.value})}
                />
                <select 
                  className="w-full p-3 rounded-xl bg-black/50 border border-zinc-800 text-white focus:border-blue-600 outline-none transition-colors"
                  value={newStudent.gender}
                  onChange={e => setNewStudent({...newStudent, gender: e.target.value})}
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="py-4 text-zinc-500 font-bold uppercase tracking-widest hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest hover:bg-zinc-200"
                  >
                    Cadastrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
};