import React, { useState, useRef, useEffect } from 'react';
import { User, Student } from '../types';
import { ChevronDown, User as UserIcon } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  students: Student[];
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, students }) => {
  const [email, setEmail] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Lista pré-definida de logins conhecidos (Admin + Alunos)
  const knownLogins = [
    'professor',
    ...students.map(s => s.email)
  ];

  // Filtra as sugestões baseado no que o usuário digitou
  const filteredSuggestions = knownLogins.filter(login => 
    login.toLowerCase().includes(email.toLowerCase())
  );

  useEffect(() => {
    // Fecha as sugestões se clicar fora do componente
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === 'professor' || cleanEmail === 'admin@abfit.com') {
      onLogin({
        name: 'André Brito',
        email: 'admin@abfit.com',
        role: 'admin'
      });
      return;
    }

    const student = students.find(s => s.email.toLowerCase() === cleanEmail);
    if (student) {
      onLogin({
        name: student.nome,
        email: student.email,
        role: 'student',
        studentId: student.id
      });
    } else {
      alert('E-mail não encontrado. Verifique ou contate o professor.');
    }
  };

  const handleSelectSuggestion = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setShowSuggestions(false);
  };

  return (
    <div 
      id="loginScreen" 
      className="flex flex-col justify-end min-h-screen pb-20 px-8 animate-fadeIn"
    >
      
      <div className="mb-auto pt-24 text-center">
        <div className="logo-wrapper transform scale-110">
            <h1 className="logo-main text-8xl mb-1">
                <span className="logo-ab">AB</span><span className="logo-fit">FIT</span>
            </h1>
            <div className="logo-divider"></div>
            <p className="logo-subtitle text-sm text-center leading-none">Assessoria em Treinamentos Físicos</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4 backdrop-blur-sm bg-black/40 p-6 rounded-2xl border border-white/10 relative">
        <div ref={wrapperRef} className="relative">
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-wider">
            Acesso Exclusivo
          </label>
          
          <div className="relative">
            <input
              type="text"
              required
              placeholder="Seu e-mail ou 'professor'"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full p-4 rounded-xl text-lg bg-black/50 border border-zinc-800 text-white placeholder-gray-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all outline-none"
              autoComplete="off"
            />
            {/* Ícone indicando dropdown */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              <ChevronDown className={`w-5 h-5 transition-transform ${showSuggestions ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Lista de Sugestões (Dropdown Customizado) */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 animate-fadeIn custom-scrollbar">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left p-4 hover:bg-zinc-800 text-gray-300 hover:text-white transition-colors border-b border-zinc-800 last:border-0 flex items-center gap-3"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${suggestion === 'professor' ? 'bg-red-900/30 text-red-500' : 'bg-zinc-800 text-zinc-500'}`}>
                    {suggestion === 'professor' ? 'P' : <UserIcon className="w-4 h-4" />}
                  </div>
                  <span className="truncate text-sm">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase py-4 rounded-xl shadow-lg shadow-red-900/40 transition-all transform active:scale-95 text-sm tracking-widest"
        >
          Acessar Plataforma
        </button>
      </form>
      
      <p className="mt-6 text-center text-[10px] text-gray-600 font-mono">
        v3.0 FIX &bull; SYSTEM ONLINE
      </p>
    </div>
  );
};

export default LoginScreen;