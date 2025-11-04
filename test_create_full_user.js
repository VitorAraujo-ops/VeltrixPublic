// Script de teste para verificar se a Edge Function create-full-user está funcionando
// Execute este script para testar a criação de um novo usuário owner

const SUPABASE_URL = 'https://tvjjwmwuwheiiqvugbak.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2amp3bXd1d2hlaWlxdXZnYmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzAsImV4cCI6MjA1MDU0ODk3MH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

async function testCreateFullUser() {
  const testData = {
    formData: {
      name: "Teste Owner",
      email: `teste.owner.${Date.now()}@teste.com`,
      password: "123456",
      phone: "(11) 99999-9999",
      companyName: "Empresa Teste",
      document: "12.345.678/0001-90",
      userType: "PJ",
      street: "Rua Teste",
      number: "123",
      complement: "Sala 1",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zip: "01234-567"
    },
    userRole: "owner"
  };

  try {
    console.log('🔄 Testando criação de usuário owner...');
    console.log('📧 Email:', testData.formData.email);
    console.log('🏢 Empresa:', testData.formData.companyName);

    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-full-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Sucesso! Usuário criado:', result);
      
      // Verificar se os códigos foram gerados
      console.log('\n🔍 Verificando se os códigos foram gerados...');
      await checkTenantCodes(testData.formData.companyName);
      
    } else {
      console.log('❌ Erro na criação:', result);
    }

  } catch (error) {
    console.log('❌ Erro no teste:', error);
  }
}

async function checkTenantCodes(companyName) {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data, error } = await supabase
      .from('tenants')
      .select('id, name, invite_code_socio, invite_code_funcionario')
      .eq('name', companyName)
      .single();

    if (error) {
      console.log('❌ Erro ao buscar tenant:', error);
      return;
    }

    console.log('\n📊 Resultado da verificação:');
    console.log('🏢 Empresa:', data.name);
    console.log('🆔 ID:', data.id);
    console.log('👑 Código Sócio:', data.invite_code_socio || '❌ NÃO GERADO');
    console.log('👥 Código Funcionário:', data.invite_code_funcionario || '❌ NÃO GERADO');

    if (data.invite_code_socio && data.invite_code_funcionario) {
      console.log('\n🎉 SUCESSO! Ambos os códigos foram gerados corretamente!');
    } else {
      console.log('\n⚠️ ATENÇÃO! Um ou ambos os códigos não foram gerados.');
    }

  } catch (error) {
    console.log('❌ Erro na verificação:', error);
  }
}

// Executar o teste
testCreateFullUser();
