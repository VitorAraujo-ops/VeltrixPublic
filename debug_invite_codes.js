// Script de debug para verificar os códigos de convite
// Execute este script no console do navegador na página de gerenciamento da empresa

const SUPABASE_URL = 'https://tvjjwmwuwheiiqvugbak.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2amp3bXd1d2hlaWlxdXZnYmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzAsImV4cCI6MjA1MDU0ODk3MH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

async function debugInviteCodes() {
  try {
    // 1. Verificar se o usuário está logado
    console.log('🔍 Verificando usuário logado...');
    
    // Simular a busca que o componente faz
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // 2. Obter o usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('❌ Erro ao obter usuário:', userError);
      return;
    }
    
    if (!user) {
      console.log('❌ Nenhum usuário logado');
      return;
    }
    
    console.log('✅ Usuário logado:', user.email);
    console.log('🆔 User ID:', user.id);
    
    // 3. Buscar dados do usuário na tabela users
    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('id, email, role, tenant_id, tenant_slug')
      .eq('id', user.id)
      .single();
    
    if (userDataError) {
      console.log('❌ Erro ao buscar dados do usuário:', userDataError);
      return;
    }
    
    console.log('📊 Dados do usuário:', userData);
    console.log('🏢 Tenant ID:', userData.tenant_id);
    
    if (!userData.tenant_id) {
      console.log('❌ Usuário não tem tenant_id');
      return;
    }
    
    // 4. Buscar dados do tenant
    const { data: tenantData, error: tenantError } = await supabase
      .from('tenants')
      .select('id, name, invite_code_socio, invite_code_funcionario')
      .eq('id', userData.tenant_id)
      .single();
    
    if (tenantError) {
      console.log('❌ Erro ao buscar tenant:', tenantError);
      return;
    }
    
    console.log('🏢 Dados do tenant:', tenantData);
    console.log('👑 Código Sócio:', tenantData.invite_code_socio || 'NULL');
    console.log('👥 Código Funcionário:', tenantData.invite_code_funcionario || 'NULL');
    
    // 5. Verificar se os códigos existem
    if (!tenantData.invite_code_socio || !tenantData.invite_code_funcionario) {
      console.log('⚠️ ATENÇÃO: Códigos de convite não encontrados!');
      console.log('💡 Execute o script SQL fix_invite_codes_immediate.sql no Supabase');
    } else {
      console.log('✅ Códigos de convite encontrados!');
    }
    
  } catch (error) {
    console.log('❌ Erro no debug:', error);
  }
}

// Executar o debug
debugInviteCodes();
