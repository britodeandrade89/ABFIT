import React, { useState } from 'react';
import { User, Student, Assessment } from '../types';
import { ArrowLeft, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AssessmentViewProps {
  studentId?: string;
  currentUser: User | null;
  students: Student[];
  onUpdateStudents: (students: Student[]) => void;
  onBack: () => void;
}

const AssessmentView: React.FC<AssessmentViewProps> = ({ 
  studentId, 
  currentUser, 
  students, 
  onUpdateStudents, 
  onBack 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Assessment>>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    height: 0,
    chestFold: 0,
    abdominalFold: 0
  });

  const student = students.find(s => s.id === studentId);

  if (!student) return <div className="p-10 text-center">Aluno não encontrado</div>;

  const assessments = student.avaliacoes || [];
  const latestAssessment = assessments[assessments.length - 1];
  const imc = latestAssessment 
    ? (latestAssessment.weight / Math.pow(latestAssessment.height / 100, 2)).toFixed(1) 
    : '-';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newAssessment: Assessment = {
      date: formData.date!,
      weight: Number(formData.weight),
      height: Number(formData.height),
      chestFold: Number(formData.chestFold),
      abdominalFold: Number(formData.abdominalFold)
    };

    const updatedStudents = students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          avaliacoes: [...(s.avaliacoes || []), newAssessment]
        };
      }
      return s;
    });

    onUpdateStudents(updatedStudents); // This will trigger checkAchievements in App.tsx
    setIsAdding(false);
  };

  // Prepare chart data
  const chartData = assessments.map(a => ({
    date: new Date(a.date).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}),
    weight: a.weight
  })).slice(-6); // Last 6 entries

  return (
    <div className="animate-fadeIn min-h-screen bg-black pb-20">
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-zinc-900 p-4 flex items-center justify-between shadow-2xl">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white border border-zinc-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Avaliação Física</h2>
        <div className="w-10"></div>
      </div>

      <div className="p-6">
        {isAdding ? (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-6">Nova Avaliação</h3>
            <form onSubmit={handleSave} className="space-y-6">
              <input 
                type="date" 
                required
                className="input-dark w-full p-4 rounded-xl text-sm bg-zinc-900 border border-zinc-800 text-white focus:border-green-600 outline-none"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="Peso (kg)" 
                  step="0.1"
                  required
                  className="input-dark w-full p-4 rounded-xl text-sm bg-zinc-900 border border-zinc-800 text-white focus:border-green-600 outline-none"
                  value={formData.weight || ''}
                  onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})}
                />
                <input 
                  type="number" 
                  placeholder="Altura (cm)" 
                  step="1"
                  required
                  className="input-dark w-full p-4 rounded-xl text-sm bg-zinc-900 border border-zinc-800 text-white focus:border-green-600 outline-none"
                  value={formData.height || ''}
                  onChange={e => setFormData({...formData, height: parseFloat(e.target.value)})}
                />
              </div>
              <input 
                type="number" 
                placeholder="Dobra Peitoral (mm)" 
                className="input-dark w-full p-4 rounded-xl text-sm bg-zinc-900 border border-zinc-800 text-white focus:border-green-600 outline-none"
                value={formData.chestFold || ''}
                onChange={e => setFormData({...formData, chestFold: parseFloat(e.target.value)})}
              />
              <input 
                type="number" 
                placeholder="Dobra Abdominal (mm)" 
                className="input-dark w-full p-4 rounded-xl text-sm bg-zinc-900 border border-zinc-800 text-white focus:border-green-600 outline-none"
                value={formData.abdominalFold || ''}
                onChange={e => setFormData({...formData, abdominalFold: parseFloat(e.target.value)})}
              />
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="w-1/3 py-4 text-zinc-500 font-bold uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="w-2/3 bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-xl uppercase tracking-widest shadow-lg"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">Resultados</p>
                <h2 className="text-2xl font-bold text-white leading-none">{student.nome}</h2>
              </div>
              {currentUser?.role === 'admin' && (
                <button 
                  onClick={() => setIsAdding(true)}
                  className="bg-blue-600/20 text-blue-500 hover:bg-blue-600 hover:text-white p-2 rounded-lg transition-all"
                >
                  <Plus className="w-6 h-6" />
                </button>
              )}
            </div>

            {assessments.length === 0 ? (
              <div className="text-center py-10 text-zinc-500">
                Nenhuma avaliação registrada.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900/50 p-5 rounded-3xl border border-zinc-800 backdrop-blur-sm">
                    <p className="text-xs text-zinc-500 font-bold uppercase">Peso Atual</p>
                    <p className="text-3xl text-white font-black mt-1">{latestAssessment.weight} <span className="text-sm font-normal text-zinc-500">kg</span></p>
                  </div>
                  <div className="bg-zinc-900/50 p-5 rounded-3xl border border-zinc-800 backdrop-blur-sm">
                    <p className="text-xs text-zinc-500 font-bold uppercase">IMC</p>
                    <p className={`text-3xl font-black mt-1 ${parseFloat(imc) > 25 ? 'text-yellow-500' : 'text-blue-500'}`}>{imc}</p>
                  </div>
                </div>

                <div className="bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800">
                  <h4 className="text-xs text-zinc-500 font-bold uppercase mb-4 pl-2">Evolução de Peso</h4>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="date" stroke="#666" tick={{fontSize: 10}} />
                        <YAxis stroke="#666" tick={{fontSize: 10}} domain={['dataMin - 2', 'dataMax + 2']} />
                        <Tooltip 
                          contentStyle={{backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px'}}
                          itemStyle={{color: '#fff'}}
                        />
                        <Line type="monotone" dataKey="weight" stroke="#dc2626" strokeWidth={3} dot={{r: 4, fill: '#dc2626'}} activeDot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-800">
                   <h4 className="text-xs text-zinc-500 font-bold uppercase mb-4">Composição (Última)</h4>
                   <div className="space-y-3">
                      <div className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-400 text-sm">Dobra Peitoral</span>
                        <span className="text-white font-mono">{latestAssessment.chestFold || '-'} mm</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-400 text-sm">Dobra Abdominal</span>
                        <span className="text-white font-mono">{latestAssessment.abdominalFold || '-'} mm</span>
                      </div>
                   </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentView;