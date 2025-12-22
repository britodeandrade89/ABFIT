import { Student, Achievement, RunningWorkout } from '../types';

const STORAGE_KEY = 'physiapp_alunos';

// URL da nova foto de perfil (Substitua esta URL pela da sua foto real se desejar)
// Opção 1: URL de imagem hospedada (Imgur, S3, etc)
// Opção 2: Caminho local na pasta public (ex: '/minha-foto.jpg')
const ANDRE_PHOTO_URL = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop';

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'welcome', title: 'Bem-vindo ao Time', description: 'Iniciou sua jornada na ABFIT', icon: 'medal', unlocked: true, unlockedAt: new Date().toISOString() },
  { id: 'first_assessment', title: 'Primeiros Passos', description: 'Realizou a primeira avaliação física', icon: 'zap', unlocked: false },
  { id: 'first_goal', title: 'Foco Total', description: 'Concluiu sua primeira meta pessoal', icon: 'target', unlocked: false },
  { id: 'consistency_king', title: 'Lenda do Treino', description: 'Concluiu 5 metas pessoais', icon: 'crown', unlocked: false },
  { id: 'star_student', title: 'Dedicação', description: 'Manteve 3 metas ativas simultaneamente', icon: 'star', unlocked: false },
];

const generateRunningSchedule = (): RunningWorkout[] => {
  const schedule: RunningWorkout[] = [];
  // Start date: Dec 1, 2025 (Monday)
  let currentDate = new Date('2025-12-01T12:00:00');
  
  // Create 4 weeks of workouts
  for (let week = 0; week < 4; week++) {
    // 1. Monday: Tiros (Intervals)
    schedule.push({
      id: `run_week${week}_1`,
      type: 'TIRO',
      title: 'Tiros Intensos (HIIT)',
      scheduledDate: currentDate.toISOString().split('T')[0],
      targetDistance: 'Variável',
      targetDistanceNum: 5, // Estimated base
      targetDuration: '30min',
      targetDurationNum: 30,
      warmup: '10min: Caminhada progressiva (5km/h) a trote leve (8km/h).',
      main: '15min: 10x 1min Forte (12-14km/h) / 30s Caminhada. Sinta a queimação!',
      cooldown: '5min: Caminhada lenta para voltar à calma.',
      status: 'pending'
    });

    // Move to Wednesday (Rodagem)
    currentDate.setDate(currentDate.getDate() + 2);
    schedule.push({
      id: `run_week${week}_2`,
      type: 'RODAGEM',
      title: 'Rodagem Regenerativa',
      scheduledDate: currentDate.toISOString().split('T')[0],
      targetDistance: '4km',
      targetDistanceNum: 4,
      targetDuration: '30min',
      targetDurationNum: 30,
      warmup: '5min: Caminhada vigorosa.',
      main: '25min: Corrida contínua em Z2 (Confortável). Mantenha pace de 6:30-7:00 min/km. O objetivo é volume, não velocidade.',
      cooldown: 'Alongamento estático leve.',
      status: 'pending'
    });

    // Move to Friday (Fartlek)
    currentDate.setDate(currentDate.getDate() + 2);
    schedule.push({
      id: `run_week${week}_3`,
      type: 'FARTLEK',
      title: 'Fartlek Dinâmico',
      scheduledDate: currentDate.toISOString().split('T')[0],
      targetDistance: '5km',
      targetDistanceNum: 5,
      targetDuration: '35min',
      targetDurationNum: 35,
      warmup: '5min Trote leve.',
      main: '25min: Brincadeira de velocidade. Alterne livremente: Corra forte até a próxima esquina, trote até o poste. Mínimo de 6 estímulos fortes durante o trajeto.',
      cooldown: '5min Caminhada.',
      status: 'pending'
    });

     // Move to Sunday (Ritmo)
     currentDate.setDate(currentDate.getDate() + 2);
     schedule.push({
       id: `run_week${week}_4`,
       type: 'RITMO',
       title: 'Tempo Run (Ritmo)',
       scheduledDate: currentDate.toISOString().split('T')[0],
       targetDistance: '5km',
       targetDistanceNum: 5,
       targetDuration: '30min',
       targetDurationNum: 30,
       warmup: '5min Trote.',
       main: '20min: Ritmo sustentado "confortavelmente difícil" (Z3). Tente segurar 10-11km/h constantes sem oscilar.',
       cooldown: '5min Trote regenerativo.',
       status: 'pending'
     });

     // Reset to next Monday
     currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedule;
};

export const getStudents = (): Student[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  
  const students: Student[] = JSON.parse(saved);
  
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
    // Initial Data Creation
    const defaultStudents: Student[] = [
      { 
        id: '1', 
        nome: 'André Brito', 
        email: 'britodeandrade@gmail.com', 
        sexo: 'Masculino', 
        nascimento: '1990-01-01', 
        photoUrl: ANDRE_PHOTO_URL, // Updated photo URL
        avaliacoes: [], 
        goals: [], 
        achievements: [],
        runningWorkouts: generateRunningSchedule(), 
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
  } else {
    // FORCE UPDATE: Check if André (ID 1) needs a profile photo update
    // This allows the photo to change even if the user already has data stored.
    let hasChanges = false;
    const updatedStudents = existing.map(s => {
        if (s.id === '1' && s.photoUrl !== ANDRE_PHOTO_URL) {
            hasChanges = true;
            return { ...s, photoUrl: ANDRE_PHOTO_URL };
        }
        return s;
    });

    if (hasChanges) {
        saveStudents(updatedStudents);
    }
  }
};

export const checkAchievements = (student: Student): Student => {
  let updated = false;
  const newAchievements = student.achievements.map(a => ({...a}));

  if (student.avaliacoes.length > 0) {
    const achIndex = newAchievements.findIndex(a => a.id === 'first_assessment');
    if (achIndex !== -1 && !newAchievements[achIndex].unlocked) {
      newAchievements[achIndex].unlocked = true;
      newAchievements[achIndex].unlockedAt = new Date().toISOString();
      updated = true;
    }
  }

  const completedGoals = student.goals.filter(g => g.completed).length;
  if (completedGoals >= 1) {
    const achIndex = newAchievements.findIndex(a => a.id === 'first_goal');
    if (achIndex !== -1 && !newAchievements[achIndex].unlocked) {
      newAchievements[achIndex].unlocked = true;
      newAchievements[achIndex].unlockedAt = new Date().toISOString();
      updated = true;
    }
  }

  if (completedGoals >= 5) {
    const achIndex = newAchievements.findIndex(a => a.id === 'consistency_king');
    if (achIndex !== -1 && !newAchievements[achIndex].unlocked) {
      newAchievements[achIndex].unlocked = true;
      newAchievements[achIndex].unlockedAt = new Date().toISOString();
      updated = true;
    }
  }

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