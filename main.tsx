import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- Configuração de Variáveis de Ambiente (Polyfill) ---
// Isso garante que o app consiga ler a chave API tanto do .env do Vite
// quanto de um fallback seguro, resolvendo o erro de conexão com a IA.
if (typeof window !== 'undefined') {
  // Cria o objeto process.env se não existir no navegador
  if (!(window as any).process) {
    (window as any).process = { env: {} };
  }
  
  // 1. Tenta pegar do Vite (Padrão correto)
  // @ts-ignore
  const viteEnv = import.meta.env?.VITE_API_KEY;
  
  // 2. Chave de Fallback (A que você forneceu) para garantir o funcionamento imediato
  const FALLBACK_KEY = "AIzaSyCJ9K6sovkNzeO_fuQbSPD9LnIUG0p8Da4";

  // Define a chave para a biblioteca do Google usar
  (window as any).process.env.API_KEY = viteEnv || FALLBACK_KEY;
  
  console.log("Sistema ABFIT Iniciado. API Key configurada:", !!(window as any).process.env.API_KEY);
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