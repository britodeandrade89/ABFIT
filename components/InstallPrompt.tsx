import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detectar se é iOS (iPhone/iPad)
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // Detectar se já está instalado (Standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (isStandalone) {
      return; // Não mostrar se já estiver instalado
    }

    // Para Android/Chrome (Captura o evento de instalação)
    const handler = (e: any) => {
      e.preventDefault(); // Impede o mini-infobar padrão do navegador
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Para iOS, mostramos o banner logo de cara (pois não tem evento beforeinstallprompt)
    if (isIosDevice) {
      setShowInstallBanner(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 p-4 animate-fadeIn">
      <div className="bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
        
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40">
               <span className="font-black italic text-white text-xs">AB</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Instalar App 1.5 ABFIT</h3>
              <p className="text-xs text-zinc-400">Acesse seus treinos offline e mais rápido.</p>
            </div>
          </div>
          <button onClick={() => setShowInstallBanner(false)} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isIOS ? (
          // Instruções Específicas para iOS
          <div className="bg-black/50 rounded-lg p-3 text-xs text-zinc-300 border border-zinc-800">
            <p className="flex items-center gap-2 mb-1">
              1. Toque no botão de compartilhar <Share className="w-3 h-3" />
            </p>
            <p className="flex items-center gap-2">
              2. Selecione <span className="font-bold text-white">"Adicionar à Tela de Início"</span>
            </p>
          </div>
        ) : (
          // Botão Padrão para Android/Desktop
          <button 
            onClick={handleInstallClick}
            className="w-full py-3 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 text-xs"
          >
            <Download className="w-4 h-4" /> Instalar Agora
          </button>
        )}
      </div>
    </div>
  );
};