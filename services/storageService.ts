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
      { id: '1', nome: 'André Brito', email: 'britodeandrade@gmail.com', sexo: 'Masculino', nascimento: '1990-01-01', avaliacoes: [], goals: [], achievements: [], workouts: [] },
      { id: '2', nome: 'Marcelly Bispo', email: 'marcellybispo92@gmail.com', sexo: 'Feminino', nascimento: '1992-05-15', avaliacoes: [], goals: [], achievements: [], workouts: [] },
      { id: '3', nome: 'Marcia Brito', email: 'andrademarcia.ucam@gmail.com', sexo: 'Feminino', nascimento: '1985-03-20', avaliacoes: [], goals: [], achievements: [], workouts: [] },
      { id: '4', nome: 'Rebecca Brito', email: 'arbrito.andrade@gmail.com', sexo: 'Feminino', nascimento: '2000-08-10', avaliacoes: [], goals: [], achievements: [], workouts: [] },
      { id: '5', nome: 'Liliane Torres', email: 'lilicatorres@gmail.com', sexo: 'Feminino', nascimento: '1988-11-05', avaliacoes: [], goals: [], achievements: [], workouts: [] }
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