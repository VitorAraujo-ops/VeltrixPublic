// Script para limpar completamente as sessões do Supabase
// Execute este script no console do navegador para limpar todas as sessões

console.log('🧹 Iniciando limpeza de sessões...');

// Lista de chaves conhecidas do Supabase
const supabaseKeys = [
  'sb-bhaeutxottfrceqebdwc-auth-token',
  'supabase.auth.token',
  'supabase.auth.refresh_token',
  'supabase.auth.session'
];

// Limpar chaves conhecidas
supabaseKeys.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ Removido: ${key}`);
  }
});

// Limpar todas as chaves que contenham 'supabase' ou 'sb-'
const keysToRemove = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && (key.includes('supabase') || key.includes('sb-'))) {
    keysToRemove.push(key);
  }
}

keysToRemove.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ Removido: ${key}`);
});

// Limpar sessionStorage também
const sessionKeysToRemove = [];
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  if (key && (key.includes('supabase') || key.includes('sb-'))) {
    sessionKeysToRemove.push(key);
  }
}

sessionKeysToRemove.forEach(key => {
  sessionStorage.removeItem(key);
  console.log(`✅ Removido do sessionStorage: ${key}`);
});

console.log('🎉 Limpeza concluída! Recarregue a página para aplicar as mudanças.');
console.log('📝 Para aplicar permanentemente, pressione F5 ou Ctrl+R');
