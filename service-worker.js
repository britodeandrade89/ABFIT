// Service Worker "Kill Switch"
// Isso garante que qualquer versão antiga em cache seja removida e o app funcione apenas online.

self.addEventListener('install', () => {
  // Força o SW a ativar imediatamente
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Remove o registro do SW e recarrega as páginas abertas para garantir versão nova
  event.waitUntil(
    self.registration.unregister()
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => {
        for (const client of clients) {
          // Opcional: Recarregar a página para garantir que o SW sumiu
          // client.navigate(client.url);
        }
      })
  );
});