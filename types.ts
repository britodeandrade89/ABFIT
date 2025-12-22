export interface Assessment {
  date: string;
  weight: number;
  height: number;
  chestFold?: number;
  abdominalFold?: number;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'medal' | 'zap' | 'crown' | 'target';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  load?: string;
  rest?: string;
  observation?: string;
}

export interface Workout {
  id: string;
  title: string; // e.g., "Treino A - Peito e Tríceps"
  description?: string;
  exercises: Exercise[];
}

export interface Student {
  id: string;
  nome: string;
  email: string;
  nascimento: string;
  sexo: string;
  avaliacoes: Assessment[];
  goals: Goal[];
  achievements: Achievement[];
  workouts: Workout[];
}

export interface User {
  name: string;
  email: string;
  role: 'admin' | 'student';
  studentId?: string;
}

export type ViewState = 
  | 'LOGIN' 
  | 'STUDENT_DASHBOARD' 
  | 'PROFESSOR_DASHBOARD' 
  | 'ASSESSMENT_VIEW' 
  | 'AI_CHAT'
  | 'GOALS_VIEW'
  | 'WORKOUT_MANAGER' // For Professor
  | 'STUDENT_WORKOUTS'; // For Student