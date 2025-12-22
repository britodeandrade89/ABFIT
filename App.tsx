import React, { useState, useEffect } from 'react';
import { User, Student, ViewState } from './types';
import { initData, getStudents, saveStudents, checkAchievements } from './services/storageService';
import LoginScreen from './components/LoginScreen';
import StudentDashboard from './components/StudentDashboard';
import { ProfessorDashboard } from './components/ProfessorDashboard';
import AssessmentView from './components/AssessmentView';
import AIChatScreen from './components/AIChatScreen';
import GoalsAchievementsScreen from './components/GoalsAchievementsScreen';
import WorkoutManagerScreen from './components/WorkoutManagerScreen';
import StudentWorkoutsScreen from './components/StudentWorkoutsScreen';
import RunningWorkoutsScreen from './components/RunningWorkoutsScreen';
import { InstallPrompt } from './components/InstallPrompt';
import './services/firebaseConfig';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  useEffect(() => {
    initData();
    setStudents(getStudents());
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentView('PROFESSOR_DASHBOARD');
    } else {
      setCurrentView('STUDENT_DASHBOARD');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('LOGIN');
    setSelectedStudentId(null);
  };

  const handleNavigate = (view: ViewState, studentId?: string) => {
    if (studentId) setSelectedStudentId(studentId);
    setCurrentView(view);
  };

  const updateStudents = (newStudents: Student[]) => {
    const processedStudents = newStudents.map(s => checkAchievements(s));
    setStudents(processedStudents);
    saveStudents(processedStudents);
  };

  return (
    <div className="w-full md:max-w-4xl mx-auto min-h-screen relative shadow-2xl overflow-hidden text-white font-sans bg-black">
      
      <InstallPrompt />

      {currentView === 'LOGIN' && (
        <LoginScreen onLogin={handleLogin} students={students} />
      )}

      {currentView === 'STUDENT_DASHBOARD' && currentUser && (
        <StudentDashboard 
          user={currentUser} 
          students={students}
          onUpdateStudents={updateStudents}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'PROFESSOR_DASHBOARD' && currentUser?.role === 'admin' && (
        <ProfessorDashboard
          students={students}
          onUpdateStudents={updateStudents}
          onLogout={handleLogout}
          onSelectStudent={(id) => handleNavigate('ASSESSMENT_VIEW', id)}
          onManageWorkouts={(id) => handleNavigate('WORKOUT_MANAGER', id)}
        />
      )}

      {currentView === 'ASSESSMENT_VIEW' && (
        <AssessmentView
          studentId={selectedStudentId || currentUser?.studentId}
          currentUser={currentUser}
          students={students}
          onUpdateStudents={updateStudents}
          onBack={() => {
            if (currentUser?.role === 'admin') {
              handleNavigate('PROFESSOR_DASHBOARD');
            } else {
              handleNavigate('STUDENT_DASHBOARD');
            }
          }}
        />
      )}

      {currentView === 'WORKOUT_MANAGER' && currentUser?.role === 'admin' && selectedStudentId && (
        <WorkoutManagerScreen 
          studentId={selectedStudentId}
          students={students}
          onUpdateStudents={updateStudents}
          onBack={() => handleNavigate('PROFESSOR_DASHBOARD')}
        />
      )}

      {currentView === 'STUDENT_WORKOUTS' && currentUser?.studentId && (
        <StudentWorkoutsScreen 
          studentId={currentUser.studentId}
          students={students}
          onBack={() => handleNavigate('STUDENT_DASHBOARD')}
        />
      )}

      {currentView === 'RUNNING_WORKOUTS' && currentUser?.studentId && (
        <RunningWorkoutsScreen 
          studentId={currentUser.studentId}
          students={students}
          onUpdateStudents={updateStudents}
          onBack={() => handleNavigate('STUDENT_DASHBOARD')}
        />
      )}

      {currentView === 'GOALS_VIEW' && (
        <GoalsAchievementsScreen 
           studentId={currentUser?.studentId}
           students={students}
           onUpdateStudents={updateStudents}
           onBack={() => handleNavigate('STUDENT_DASHBOARD')}
        />
      )}

      {currentView === 'AI_CHAT' && (
        <AIChatScreen 
          onBack={() => handleNavigate('STUDENT_DASHBOARD')}
          userName={currentUser?.name || 'Atleta'}
        />
      )}
    </div>
  );
};

export default App;