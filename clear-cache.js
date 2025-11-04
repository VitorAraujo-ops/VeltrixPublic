// Script para limpar cache do navegador
// Execute este script no console do navegador

console.log('🧹 Limpando cache do navegador...');

// Limpar localStorage
localStorage.clear();
console.log('✅ localStorage limpo');

// Limpar sessionStorage
sessionStorage.clear();
console.log('✅ sessionStorage limpo');

// Limpar cache do service worker (se existir)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
  console.log('✅ Service workers removidos');
}

// Limpar cache do navegador
if ('caches' in window) {
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name);
    }
  });
  console.log('✅ Cache do navegador limpo');
}

// Forçar reload da página
console.log('🔄 Recarregando página...');
window.location.reload(true);
