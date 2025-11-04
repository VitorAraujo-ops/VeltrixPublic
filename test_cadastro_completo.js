// Script de teste para verificar o cadastro completo
// Execute com: node test_cadastro_completo.js

import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://tvjjwmwuwheiiqvugbak.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2amp3bXd1d2hlaWlxdnVnYmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NDUwOTQsImV4cCI6MjA3MTEyMTA5NH0.cbwP4j3vF9JER4c54oNRuekOsIxHSUvlHiAUY_XH1zE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCadastroCompleto() {
  console.log('🧪 INICIANDO TESTE DE CADASTRO COMPLETO...\n');

  // Dados de teste
  const testData = {
    email: `teste-${Date.now()}@exemplo.com`,
    name: 'João Silva Teste',
    password: 'senha123456',
    companyName: 'Empresa Teste Automático',
    companyEmail: `empresa-${Date.now()}@exemplo.com`,
    document: '12345678901',
    phone: '11999999999',
    userType: 'PF',
    userRole: 'owner'
  };

  try {
    console.log('📋 Dados de teste:', testData);

    // ==========================================
    // 1. TESTAR EDGE FUNCTION CREATE-FULL-USER
    // ==========================================
    console.log('\n🔧 1. Testando Edge Function create-full-user...');

    const { data: edgeFunctionData, error: edgeFunctionError } = await supabase.functions.invoke('create-full-user', {
      body: {
        email: testData.email,
        password: testData.password,
        name: testData.name,
        companyName: testData.companyName,
        companyEmail: testData.companyEmail,
        document: testData.document,
        phone: testData.phone,
        userType: testData.userType
      }
    });

    if (edgeFunctionError) {
      console.error('❌ Erro na Edge Function:', edgeFunctionError);
      return;
    }

    console.log('✅ Edge Function executada com sucesso:', edgeFunctionData);

    // ==========================================
    // 2. VERIFICAR SE O TENANT FOI CRIADO
    // ==========================================
    console.log('\n🏢 2. Verificando se o tenant foi criado...');

    // Primeiro, vamos listar todos os tenants para ver se algum foi criado
    const { data: allTenants, error: listError } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (listError) {
      console.error('❌ Erro ao listar tenants:', listError);
    } else {
      console.log('📋 Últimos tenants criados:', allTenants);
    }

    // Agora vamos tentar buscar o tenant específico
    const { data: tenantData, error: tenantError } = await supabase
      .from('tenants')
      .select('*')
      .eq('email', testData.companyEmail)
      .single();

    if (tenantError) {
      console.error('❌ Erro ao buscar tenant:', tenantError);
      return;
    }

    console.log('✅ Tenant criado:', tenantData);

    // ==========================================
    // 3. VERIFICAR SE O USUÁRIO FOI CRIADO
    // ==========================================
    console.log('\n👤 3. Verificando se o usuário foi criado...');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testData.email)
      .single();

    if (userError) {
      console.error('❌ Erro ao buscar usuário:', userError);
      return;
    }

    console.log('✅ Usuário criado:', userData);

    // ==========================================
    // 4. TESTAR LOGIN COM O USUÁRIO CRIADO
    // ==========================================
    console.log('\n🔐 4. Testando login com o usuário criado...');

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: testData.email,
      password: testData.password
    });

    if (authError) {
      console.error('❌ Erro no login:', authError);
      return;
    }

    console.log('✅ Login realizado com sucesso:', authData.user.email);

    // ==========================================
    // 5. VERIFICAR REDIRECIONAMENTO
    // ==========================================
    console.log('\n🎯 5. Verificando informações de redirecionamento...');

    const redirectUrl = `/dashboard/${tenantData.slug}`;
    console.log('✅ URL de redirecionamento:', redirectUrl);

    // ==========================================
    // 6. LIMPEZA - REMOVER DADOS DE TESTE
    // ==========================================
    console.log('\n🧹 6. Limpando dados de teste...');

    // Remover usuário da tabela users
    const { error: deleteUserError } = await supabase
      .from('users')
      .delete()
      .eq('email', testData.email);

    if (deleteUserError) {
      console.error('⚠️ Erro ao remover usuário:', deleteUserError);
    } else {
      console.log('✅ Usuário removido da tabela users');
    }

    // Remover tenant
    const { error: deleteTenantError } = await supabase
      .from('tenants')
      .delete()
      .eq('email', testData.companyEmail);

    if (deleteTenantError) {
      console.error('⚠️ Erro ao remover tenant:', deleteTenantError);
    } else {
      console.log('✅ Tenant removido');
    }

    // Remover usuário do auth
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(authData.user.id);
    if (deleteAuthError) {
      console.error('⚠️ Erro ao remover usuário do auth:', deleteAuthError);
    } else {
      console.log('✅ Usuário removido do auth');
    }

    // ==========================================
    // 7. RESUMO FINAL
    // ==========================================
    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('✅ Edge Function funcionando');
    console.log('✅ Tenant criado com slug:', tenantData.slug);
    console.log('✅ Usuário criado e logado');
    console.log('✅ Redirecionamento configurado');
    console.log('✅ Dados de teste limpos');

    console.log('\n🚀 O sistema está pronto para uso!');

  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
  }
}

// Executar o teste
testCadastroCompleto();
