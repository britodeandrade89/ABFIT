import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill seguro para evitar crash "process is not defined" no navegador
if (typeof window !== 'undefined' && !(window as any).process) {
    (window as any).process = { env: {} };
}

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("ERRO CRÍTICO: Elemento 'root' não encontrado no HTML.");
}