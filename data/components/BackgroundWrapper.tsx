import React, { useState, useEffect } from 'react';

// Lista de imagens de alta qualidade, escuras, focadas em pesos e academia.
// Usando IDs específicos do Unsplash para garantir a qualidade e o tema dark.
const GYM_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop', // Halteres escuros no chão
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1920&auto=format&fit=crop', // Mulher treinando braço (escuro)
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1920&auto=format&fit=crop', // Visão geral academia dark
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1920&auto=format&fit=crop', // Homem na barra (silhueta)
  'https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=1920&auto=format&fit=crop', // Anilhas cromadas e pretas
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1920&auto=format&fit=crop', // Cordas navais (moody)
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1920&auto=format&fit=crop', // Supino com barra (escuro)
  'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1920&auto=format&fit=crop', // Pesos livres rack
];

interface BackgroundWrapperProps {
  children: React.ReactNode;
  trigger: string; // O nome da tela atual, que serve de gatilho para mudar a imagem
}

export const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children, trigger }) => {
  const [currentImage, setCurrentImage] = useState(GYM_BACKGROUNDS[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Inicia a transição de "apagão" suave
    setIsTransitioning(true);
    
    // Espera um pouco para trocar a imagem enquanto está "apagado"
    const timeout = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * GYM_BACKGROUNDS.length);
        setCurrentImage(GYM_BACKGROUNDS[randomIndex]);
        // Termina a transição, revelando a nova imagem
        setIsTransitioning(false);
    }, 300); // Tempo da metade da transição

    return () => clearTimeout(timeout);
  }, [trigger]); // Esse efeito roda toda vez que o 'trigger' (a tela atual) muda

  return (
    <div className="relative min-h-screen bg-[#050505]">
      {/* Camada da Imagem de Fundo 
        - z-[-2] coloca ela lá no fundo.
        - transition-opacity e duration-700 criam o efeito suave de troca.
      */}
      <div 
        className={`fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundImage: `url(${currentImage})` }}
      ></div>

      {/* Camada de Gradiente Escuro (Overlay)
        - z-[-1] fica em cima da imagem, mas atrás do conteúdo.
        - Um gradiente forte de preto (95%) nas pontas para preto (85%) no meio.
        Isso garante que o texto branco sempre será legível.
      */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-black/95 via-black/85 to-black/95 pointer-events-none"></div>

      {/* O Conteúdo do App */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};