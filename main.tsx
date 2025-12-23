import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- Configuração de Variáveis de Ambiente (Polyfill Robusto) ---
// Executa antes de qualquer renderização para garantir que a chave esteja disponível.
if (typeof window !== 'undefined') {
  // 1. Garante que o objeto process.env existe no window
  if (!(window as any).process) {
    (window as any).process = { env: {} };
  }
  if (!(window as any).process.env) {
    (window as any).process.env = {};
  }
  
  // 2. Tenta capturar a chave do ambiente de build (Vercel/Vite)
  // Usamos 'as any' para evitar erros de linter se import.meta não for reconhecido
  let viteEnv = undefined;
  try {
     viteEnv = (import.meta as any).env?.VITE_API_KEY;
  } catch (e) {
     console.warn("Vite env not detected");
  }
  
  // 3. Chave Mestra (Fallback fornecido por você)
  const FALLBACK_KEY = "AIzaSyCJ9K6sovkNzeO_fuQbSPD9LnIUG0p8Da4";

  // 4. Define a chave final globalmente
  const finalKey = viteEnv || FALLBACK_KEY;
  (window as any).process.env.API_KEY = finalKey;
  
  console.log("Sistema ABFIT Iniciado. Status da Chave API:", finalKey ? "OK (Configurada)" : "ERRO (Ausente)");
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);