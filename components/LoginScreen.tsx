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
        studentId: student.id,
        photoUrl: student.photoUrl
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
      className="h-screen flex flex-col items-center justify-between p-8 w-full animate-fadeIn relative overflow-hidden"
    >
        {/* Background Image Layer */}
        <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1637666062717-1c6bcfa4a4df?q=80&w=1000&auto=format&fit=crop')`,
                filter: 'brightness(0.4) contrast(1.1)'
            }}
        />
        
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90"></div>

        {/* Top Spacer */}
        <div className="flex-1"></div>

        {/* Main Content */}
        <div className="z-10 w-full max-w-xs flex flex-col items-center gap-12 mb-10">
            
            {/* Logo Section */}
            <div className="flex flex-col items-center">
                <h1 className="text-7xl font-black italic tracking-tighter leading-none flex items-baseline transform -skew-x-12 shadow-xl drop-shadow-lg">
                    <span className="text-[#ce1126] mr-1">AB</span>
                    <span className="text-white">FIT</span>
                </h1>
                
                {/* Thin line separator */}
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/80 to-transparent my-2 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
                
                <p className="text-gray-300 text-xs font-medium italic tracking-wider uppercase text-center text-shadow">
                    Assessoria em Treinamentos Físicos
                </p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
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
                        className="w-full p-3 bg-transparent border-b border-gray-500 text-white text-center text-lg placeholder-gray-400 focus:border-red-600 focus:outline-none transition-all rounded-none"
                        autoComplete="off"
                    />

                    {/* Lista de Sugestões (Dropdown) */}
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
                    className="w-full bg-[#ce1126] hover:bg-[#a50d1e] active:scale-95 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-black/50 transition-all text-sm"
                >
                    ENTRAR
                </button>
            </form>
        </div>

        {/* Footer */}
        <div className="z-10 pb-6">
             <a href="mailto:contato@abfit.com.br" className="text-gray-400 text-xs font-medium hover:text-white transition-colors">
                Precisa de ajuda? Fale com o suporte.
            </a>
            {/* Little aesthetic detail */}
            <div className="absolute bottom-6 right-6 text-gray-600 opacity-50">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
            </div>
        </div>
    </div>
  );
};

export default LoginScreen;