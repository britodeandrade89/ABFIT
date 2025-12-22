import React, { useState, useRef, useEffect } from 'react';
import { User, Student } from '../types';
import { User as UserIcon } from 'lucide-react';

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
      className="h-screen flex flex-col justify-center items-center p-8 w-full animate-fadeIn"
      style={{
        backgroundImage: `radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)`
      }}
    >
      <div className="text-center mb-10 transform">
        <div className="logo-wrapper">
            <h1 className="logo-main text-8xl mb-1">
                <span className="logo-ab">AB</span><span className="logo-fit">FIT</span>
            </h1>
            <div className="logo-divider"></div>
            <p className="logo-subtitle text-sm text-center leading-none">Assessoria em Treinamentos Físicos</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-4 relative">
        <div ref={wrapperRef} className="relative group w-full">
          <input
            type="text"
            required
            placeholder="Seu e-mail de aluno"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full p-4 bg-transparent border-b-2 border-gray-600 text-white text-center text-lg placeholder-gray-500 focus:border-red-600 focus:outline-none transition-all rounded-none"
            autoComplete="off"
          />
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-focus-within:w-full pointer-events-none"></div>

          {/* Lista de Sugestões (Dropdown Customizado) */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-zinc-900/95 border border-zinc-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 animate-fadeIn custom-scrollbar">
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
          className="mt-6 w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-red-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ENTRAR
        </button>
        
        <a href="mailto:contato@abfit.com.br" className="text-gray-500 text-center text-xs mt-4 hover:text-gray-300 transition-colors">
            Precisa de ajuda? Fale com o suporte.
        </a>
      </form>
    </div>
  );
};

export default LoginScreen;