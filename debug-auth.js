// Script para debugar problemas de autenticação
// Execute este script no console do navegador

console.log('🔍 Iniciando debug de autenticação...');

// 1. Verificar se há sessão ativa
const checkSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('📋 Sessão atual:', session ? 'ATIVA' : 'INATIVA');
    if (session) {
      console.log('👤 User ID:', session.user.id);
      console.log('📧 Email:', session.user.email);
      console.log('⏰ Expira em:', new Date(session.expires_at * 1000));
    }
    return session;
  } catch (error) {
    console.error('❌ Erro ao verificar sessão:', error);
    return null;
  }
};

// 2. Verificar dados do usuário
const checkUserData = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.log('❌ Nenhuma sessão ativa');
      return;
    }

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('❌ Erro ao buscar dados do usuário:', error);
    } else {
      console.log('✅ Dados do usuário:', userData);
    }
  } catch (error) {
    console.error('❌ Erro ao verificar dados do usuário:', error);
  }
};

// 3. Verificar se há timeouts ativos
const checkTimeouts = () => {
  console.log('⏰ Verificando timeouts...');
  
  // Listar todos os timeouts ativos (aproximação)
  const originalSetTimeout = window.setTimeout;
  let timeoutCount = 0;
  
  window.setTimeout = function(fn, delay, ...args) {
    timeoutCount++;
    console.log(`⏰ Timeout #${timeoutCount} criado com delay: ${delay}ms`);
    return originalSetTimeout.call(this, fn, delay, ...args);
  };
  
  setTimeout(() => {
    console.log(`📊 Total de timeouts criados: ${timeoutCount}`);
  }, 1000);
};

// 4. Monitorar mudanças de auth
const monitorAuthChanges = () => {
  console.log('👁️ Monitorando mudanças de auth...');
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.log(`🔄 EVENTO DE AUTH: ${event}`, {
      hasSession: !!session,
      userId: session?.user?.id,
      timestamp: new Date().toISOString()
    });
  });
  
  // Retornar função para parar o monitoramento
  return () => subscription.unsubscribe();
};

// 5. Verificar configurações do Supabase
const checkSupabaseConfig = () => {
  console.log('⚙️ Configurações do Supabase:');
  console.log('URL:', supabase.supabaseUrl);
  console.log('Anon Key:', supabase.supabaseKey ? 'CONFIGURADA' : 'NÃO CONFIGURADA');
  
  // Verificar se há configurações de auth
  const authConfig = supabase.auth;
  console.log('Auth config:', {
    autoRefreshToken: true, // Assumindo que está habilitado
    persistSession: true,   // Assumindo que está habilitado
  });
};

// Executar todas as verificações
const runDebug = async () => {
  console.log('🚀 Iniciando debug completo...');
  
  checkSupabaseConfig();
  await checkSession();
  await checkUserData();
  checkTimeouts();
  const stopMonitoring = monitorAuthChanges();
  
  console.log('✅ Debug iniciado! Para parar o monitoramento, execute: stopMonitoring()');
  
  // Retornar função para parar o monitoramento
  window.stopMonitoring = stopMonitoring;
};

// Executar debug
runDebug();

// Função para verificar periodicamente
const periodicCheck = setInterval(async () => {
  console.log('🔄 Verificação periódica...');
  await checkSession();
}, 30000); // A cada 30 segundos

console.log('⏰ Verificação periódica iniciada (a cada 30s). Para parar: clearInterval(periodicCheck)');
