
import { Student, Achievement } from '../types';

const STORAGE_KEY = 'physiapp_alunos';

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'welcome', title: 'Bem-vindo ao Time', description: 'Iniciou sua jornada na ABFIT', icon: 'medal', unlocked: true, unlockedAt: new Date().toISOString() },
  { id: 'first_assessment', title: 'Primeiros Passos', description: 'Realizou a primeira avaliação física', icon: 'zap', unlocked: false },
  { id: 'first_goal', title: 'Foco Total', description: 'Concluiu sua primeira meta pessoal', icon: 'target', unlocked: false },
  { id: 'consistency_king', title: 'Lenda do Treino', description: 'Concluiu 5 metas pessoais', icon: 'crown', unlocked: false },
  { id: 'star_student', title: 'Dedicação', description: 'Manteve 3 metas ativas simultaneamente', icon: 'star', unlocked: false },
];

export const getStudents = (): Student[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  
  const students: Student[] = JSON.parse(saved);
  
  // Data migration for existing students to ensure structure exists
  return students.map(s => ({
    ...s,
    goals: s.goals || [],
    workouts: s.workouts || [],
    runningWorkouts: s.runningWorkouts || [],
    history: s.history || [],
    achievements: (s.achievements && s.achievements.length > 0) 
      ? s.achievements 
      : DEFAULT_ACHIEVEMENTS.map(a => ({...a, unlocked: a.id === 'welcome' ? true : false, unlockedAt: a.id === 'welcome' ? new Date().toISOString() : undefined}))
  }));
};

export const saveStudents = (students: Student[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

export const initData = () => {
  const existing = getStudents();
  if (existing.length === 0) {
    const defaultStudents: Student[] = [
      { 
        id: '1', 
        nome: 'André Brito', 
        email: 'britodeandrade@gmail.com', 
        sexo: 'Masculino', 
        nascimento: '1990-01-01', 
        photoUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop', // Placeholder pro André
        avaliacoes: [], 
        goals: [], 
        achievements: [],
        runningWorkouts: [
          {
            id: 'run1',
            title: 'Rodagem Leve',
            targetDuration: '40min',
            targetDistance: '5km',
            warmup: '10min caminhada rápida + 5min trote leve.',
            main: '20min corrida contínua em Z2 (Ritmo confortável). Foco na respiração.',
            cooldown: '5min caminhada para baixar a frequência cardíaca.',
            status: 'pending'
          },
          {
            id: 'run2',
            title: 'Tiro de Velocidade',
            targetDuration: '30min',
            targetDistance: '4km',
            warmup: '15min trote leve.',
            main: '10x tiros de 1min forte (Z4) com 1min de descanso (caminhada).',
            cooldown: '5min trote muito leve.',
            status: 'pending'
          }
        ], 
        workouts: [
          {
            id: 'treino-a-andre',
            title: 'Treino A',
            description: 'Adaptação / Força',
            exercises: [
              { id: '1', name: 'Agachamento Livre com HBC', sets: '3', reps: '10', load: '12 kg', rest: '60s' },
              { id: '2', name: 'Leg Press Horizontal', sets: '3', reps: '10', load: '40 kg', rest: '60s' },
              { id: '3', name: 'Leg Press Horizontal Unilateral', sets: '3', reps: '10', load: '20 kg', rest: '60s' },
              { id: '4', name: 'Cadeira Extensora', sets: '3', reps: '10', load: '10 kg', rest: '60s' },
              { id: '5', name: 'Cadeira Extensora Unilateral', sets: '3', reps: '10', load: '5 kg', rest: '60s' },
              { id: '6', name: 'Supino Aberto com HBC no Banco Inclinado', sets: '3', reps: '10', load: '12 kg', rest: '60s' },
              { id: '7', name: 'Crucifixo Aberto com HBC no Banco Inclinado', sets: '3', reps: '10', load: '8 kg', rest: '60s' },
              { id: '8', name: 'Desenvolvimento Aberto com HBC no Banco 75 Graus', sets: '3', reps: '10', load: '8 kg', rest: '60s' },
              { id: '9', name: 'Extensão de Cotovelos Aberto no Solo', sets: '3', reps: '10', load: '0 kg', rest: '60s' },
              { id: '10', name: 'Extensão de Cotovelos Fechado no Solo', sets: '3', reps: '10', load: '0 kg', rest: '60s' },
              { id: '11', name: 'Abdominal Remador no Solo', sets: '3', reps: '15', load: '0 kg', rest: '60s' }
            ]
          },
          {
            id: 'treino-b-andre',
            title: 'Treino B',
            description: 'Inferior / Dorsal',
            exercises: [
              { id: '1', name: 'Agachamento Sumô com HBC', sets: '3', reps: '12', load: '16 kg', rest: '60s' },
              { id: '2', name: 'Extensão de Quadril com Caneleira', sets: '3', reps: '12', load: '5 kg', rest: '60s' },
              { id: '3', name: 'Flexão de Joelho em Pé com Caneleira', sets: '3', reps: '12', load: '5 kg', rest: '60s' },
              { id: '4', name: 'Cadeira Flexora', sets: '3', reps: '12', load: '15 kg', rest: '60s' },
              { id: '5', name: 'Cadeira Abdutora', sets: '3', reps: '12', load: '20 kg', rest: '60s' },
              { id: '6', name: 'Remada Declinado no Smith', sets: '3', reps: '12', load: '10 kg', rest: '60s' },
              { id: '7', name: 'Remada Curvada Supinada no Cross', sets: '3', reps: '12', load: '15 kg', rest: '60s' },
              { id: '8', name: 'Bíceps em Pé no Cross Barra Reta', sets: '3', reps: '12', load: '10 kg', rest: '60s' },
              { id: '9', name: 'Puxada Aberta no Pulley Alto', sets: '3', reps: '12', load: '25 kg', rest: '60s' },
              { id: '10', name: 'Puxada Supinada no Pulley Alto', sets: '3', reps: '12', load: '25 kg', rest: '60s' },
              { id: '11', name: 'Abdominal Remador no Solo', sets: '3', reps: '15', load: '0 kg', rest: '60s' }
            ]
          }
        ],
        history: [
            { id: 'h1', date: '2025-12-22', workoutTitle: 'Treino A', duration: '54 min', status: 'completed' },
            { id: 'h2', date: '2025-12-10', workoutTitle: 'Treino A', duration: '37 min', status: 'completed' },
            { id: 'h3', date: '2025-12-09', workoutTitle: 'Treino B', duration: '50 min', status: 'completed' },
            { id: 'h4', date: '2025-12-08', workoutTitle: 'Treino A', duration: '50 min', status: 'completed' }
        ]
      },
      { id: '2', nome: 'Marcelly Bispo', email: 'marcellybispo92@gmail.com', sexo: 'Feminino', nascimento: '1992-05-15', avaliacoes: [], goals: [], achievements: [], runningWorkouts: [], workouts: [], history: [] },
      { id: '3', nome: 'Marcia Brito', email: 'andrademarcia.ucam@gmail.com', sexo: 'Feminino', nascimento: '1985-03-20', avaliacoes: [], goals: [], achievements: [], runningWorkouts: [], workouts: [], history: [] },
      { id: '4', nome: 'Rebecca Brito', email: 'arbrito.andrade@gmail.com', sexo: 'Feminino', nascimento: '2000-08-10', avaliacoes: [], goals: [], achievements: [], runningWorkouts: [], workouts: [], history: [] },
      { id: '5', nome: 'Liliane Torres', email: 'lilicatorres@gmail.com', sexo: 'Feminino', nascimento: '1988-11-05', avaliacoes: [], goals: [], achievements: [], runningWorkouts: [], workouts: [], history: [] }
    ];
    
    // Apply default achievements
    const studentsWithAchievements = defaultStudents.map(s => ({
       ...s,
       achievements: DEFAULT_ACHIEVEMENTS.map(a => ({...a, unlocked: a.id === 'welcome' ? true : false, unlockedAt: a.id === 'welcome' ? new Date().toISOString() : undefined}))
    }));
    saveStudents(studentsWithAchievements);
  }
};

export const checkAchievements = (student: Student): Student => {
  let updated = false;
  // Deep copy to avoid mutating state directly before saving
  const newAchievements = student.achievements.map(a => ({...a}));

  // Logic: First Assessment
  if (student.avaliacoes.length > 0) {
    const achIndex = newAchievements.findIndex(a => a.id === 'first_assessment');
    if (achIndex !== -1 && !newAchievements[achIndex].unlocked) {
      newAchievements[achIndex].unlocked = true;
      newAchievements[achIndex].unlockedAt = new Date().toISOString();
      updated = true;
    }
  }

  // Logic: First Goal Completed
  const completedGoals = student.goals.filter(g => g.completed).length;
  if (completedGoals >= 1) {
    const achIndex = newAchievements.findIndex(a => a.id === 'first_goal');
    if (achIndex !== -1 && !newAchievements[achIndex].unlocked) {
      newAchievements[achIndex].unlocked = true;
      newAchievements[achIndex].unlockedAt = new Date().toISOString();
      updated = true;
    }
  }

  // Logic: 5 Goals Completed
  if (completedGoals >= 5) {
    const achIndex = newAchievements.findIndex(a => a.id === 'consistency_king');
    if (achIndex !== -1 && !newAchievements[achIndex].unlocked) {
      newAchievements[achIndex].unlocked = true;
      newAchievements[achIndex].unlockedAt = new Date().toISOString();
      updated = true;
    }
  }

   // Logic: 3 Active Goals
   const activeGoals = student.goals.filter(g => !g.completed).length;
   if (activeGoals >= 3) {
     const achIndex = newAchievements.findIndex(a => a.id === 'star_student');
     if (achIndex !== -1 && !newAchievements[achIndex].unlocked) {
       newAchievements[achIndex].unlocked = true;
       newAchievements[achIndex].unlockedAt = new Date().toISOString();
       updated = true;
     }
   }

  return updated ? { ...student, achievements: newAchievements } : student;
};
