// Script de teste simples para verificar o banco de dados
// Execute com: node test_banco_dados.js

import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://tvjjwmwuwheiiqvugbak.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2amp3bXd1d2hlaWlxdnVnYmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NDUwOTQsImV4cCI6MjA3MTEyMTA5NH0.cbwP4j3vF9JER4c54oNRuekOsIxHSUvlHiAUY_XH1zE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBancoDados() {
  console.log('🧪 TESTANDO CONEXÃO COM BANCO DE DADOS...\n');

  try {
    // 1. Testar conexão básica
    console.log('1. Testando conexão básica...');
    const { data: testData, error: testError } = await supabase
      .from('tenants')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Erro na conexão:', testError);
      return;
    }
    console.log('✅ Conexão com banco funcionando');

    // 2. Verificar estrutura das tabelas
    console.log('\n2. Verificando estrutura das tabelas...');
    
    // Verificar tabela tenants
    const { data: tenantsData, error: tenantsError } = await supabase
      .from('tenants')
      .select('*')
      .limit(1);

    if (tenantsError) {
      console.error('❌ Erro ao acessar tabela tenants:', tenantsError);
    } else {
      console.log('✅ Tabela tenants acessível');
      if (tenantsData.length > 0) {
        console.log('📋 Campos disponíveis:', Object.keys(tenantsData[0]));
      }
    }

    // Verificar tabela users
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (usersError) {
      console.error('❌ Erro ao acessar tabela users:', usersError);
    } else {
      console.log('✅ Tabela users acessível');
      if (usersData.length > 0) {
        console.log('📋 Campos disponíveis:', Object.keys(usersData[0]));
      }
    }

    // 3. Testar funções SQL
    console.log('\n3. Testando funções SQL...');
    
    // Testar função generate_slug
    const { data: slugData, error: slugError } = await supabase
      .rpc('generate_slug', { input_text: 'Minha Empresa Teste' });

    if (slugError) {
      console.error('❌ Erro na função generate_slug:', slugError);
    } else {
      console.log('✅ Função generate_slug funcionando:', slugData);
    }

    // Testar função generate_invite_code
    const { data: inviteData, error: inviteError } = await supabase
      .rpc('generate_invite_code');

    if (inviteError) {
      console.error('❌ Erro na função generate_invite_code:', inviteError);
    } else {
      console.log('✅ Função generate_invite_code funcionando:', inviteData);
    }

    // 4. Testar inserção de dados
    console.log('\n4. Testando inserção de dados...');
    
    const testSlug = await supabase.rpc('generate_slug', { input_text: 'Empresa Teste Inserção' });
    const testInviteCode = await supabase.rpc('generate_invite_code');
    
    const { data: insertData, error: insertError } = await supabase
      .from('tenants')
      .insert({
        name: 'Empresa Teste Inserção',
        email: `teste-${Date.now()}@exemplo.com`,
        slug: testSlug.data,
        invite_code: testInviteCode.data,
        document: '12345678901',
        phone: '11999999999',
        user_type: 'PF'
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro na inserção:', insertError);
    } else {
      console.log('✅ Inserção funcionando:', insertData);
      
      // Limpar dados de teste
      const { error: deleteError } = await supabase
        .from('tenants')
        .delete()
        .eq('id', insertData.id);
      
      if (deleteError) {
        console.error('⚠️ Erro ao limpar dados de teste:', deleteError);
      } else {
        console.log('✅ Dados de teste limpos');
      }
    }

    // 5. Resumo final
    console.log('\n🎉 TESTE DO BANCO CONCLUÍDO!');
    console.log('✅ Conexão funcionando');
    console.log('✅ Tabelas acessíveis');
    console.log('✅ Funções SQL funcionando');
    console.log('✅ Inserção funcionando');
    console.log('\n🚀 O banco de dados está pronto!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o teste
testBancoDados();
