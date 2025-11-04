const fs = require('fs');
const path = require('path');

// Função para remover o componente de debug
function removeDebugComponent() {
  const appFile = path.join(__dirname, 'src', 'App.tsx');
  
  try {
    let content = fs.readFileSync(appFile, 'utf8');
    
    // Remover o componente DebugInfo
    content = content.replace(/\/\/ Componente de debug temporário[\s\S]*?function DebugInfo\(\) \{[\s\S]*?\}/g, '');
    
    // Remover a chamada do DebugInfo no AppRoutes
    content = content.replace(/<>\s*<DebugInfo \/>\s*<Routes>/g, '<Routes>');
    content = content.replace(/<\/Routes>\s*<\/>/g, '</Routes>');
    
    // Remover os console.log de debug
    content = content.replace(/console\.log\('🔍 PublicOnlyRoute - loading:', loading, 'user:', user\?\.email, 'tenant:', tenant\?\.slug\);/g, '');
    content = content.replace(/console\.log\('⏳ PublicOnlyRoute - Mostrando loading'\);/g, '');
    content = content.replace(/console\.log\('👤 PublicOnlyRoute - Usuário logado, redirecionando\.\.\.'\);/g, '');
    content = content.replace(/console\.log\('🎯 PublicOnlyRoute - Redirecionando para:', destination\);/g, '');
    content = content.replace(/console\.log\('⏳ PublicOnlyRoute - Usuário sem tenant, mostrando loading'\);/g, '');
    content = content.replace(/console\.log\('🔐 PublicOnlyRoute - Mostrando tela de login'\);/g, '');
    
    fs.writeFileSync(appFile, content);
    console.log('✅ Componente de debug removido com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao remover componente de debug:', error);
  }
}

// Função para limpar logs de debug do AuthContext
function cleanAuthContextLogs() {
  const authFile = path.join(__dirname, 'src', 'contexts', 'AuthContext.tsx');
  
  try {
    let content = fs.readFileSync(authFile, 'utf8');
    
    // Remover logs de debug específicos
    content = content.replace(/console\.log\('📊 Estado inicial - loading:', loading, 'user:', user, 'tenant:', tenant\);/g, '');
    content = content.replace(/console\.log\('🔍 Verificando sessão atual\.\.\.'\);/g, '');
    content = content.replace(/console\.log\('📋 Sessão encontrada:', currentSession \? 'SIM' : 'NÃO'\);/g, '');
    content = content.replace(/console\.log\('🏢 Buscando dados do tenant:', userData\.tenant_id\);/g, '');
    content = content.replace(/console\.log\('⚠️ Tenant não encontrado'\);/g, '');
    content = content.replace(/console\.log\('ℹ️ Usuário não tem tenant_id'\);/g, '');
    content = content.replace(/console\.log\('🔐 Buscando permissões do funcionário'\);/g, '');
    content = content.replace(/console\.log\('✅ Finalizando fetchUserData - loading: false'\);/g, '');
    content = content.replace(/console\.log\('🧹 AuthProvider cleanup'\);/g, '');
    
    fs.writeFileSync(authFile, content);
    console.log('✅ Logs de debug do AuthContext removidos!');
    
  } catch (error) {
    console.error('❌ Erro ao limpar logs do AuthContext:', error);
  }
}

// Executar limpeza
console.log('🧹 Iniciando limpeza dos componentes de debug...');
removeDebugComponent();
cleanAuthContextLogs();
console.log('✅ Limpeza concluída! A aplicação está pronta para produção.');
