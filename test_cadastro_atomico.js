// Script de teste para verificar se o cadastro atômico está funcionando
// Execute este script para testar a criação de usuários via Edge Function

const SUPABASE_URL = 'https://tvjjwmwuwheiiqvugbak.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2amp3bXd1d2hlaWlxdXZnYmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzAsImV4cCI6MjA1MDU0ODk3MH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

async function testCadastroAtomico() {
  console.log('🧪 Testando cadastro atômico...\n');

  // Teste 1: Cadastro de Owner
  console.log('📋 Teste 1: Cadastro de Owner');
  const ownerData = {
    formData: {
      name: "João Silva",
      email: `joao.silva.${Date.now()}@teste.com`,
      password: "123456",
      phone: "(11) 99999-9999",
      companyName: "Empresa Teste Owner",
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
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-full-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify(ownerData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Owner criado com sucesso:', result);
      
      // Verificar se o tenant foi criado
      await verificarTenantCriado(ownerData.formData.companyName);
      
      // Verificar se os códigos foram gerados
      await verificarCodigosGerados(ownerData.formData.companyName);
      
    } else {
      console.log('❌ Erro na criação do owner:', result);
    }

  } catch (error) {
    console.log('❌ Erro no teste do owner:', error);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Teste 2: Cadastro de Funcionário (se houver código de convite)
  console.log('📋 Teste 2: Cadastro de Funcionário');
  
  // Primeiro, buscar um código de convite válido
  const inviteCode = await buscarCodigoConvite();
  
  if (inviteCode) {
    const employeeData = {
      formData: {
        name: "Maria Santos",
        email: `maria.santos.${Date.now()}@teste.com`,
        password: "123456",
        phone: "(11) 88888-8888",
        inviteCode: inviteCode
      },
      userRole: "employee"
    };

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-full-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify(employeeData)
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Funcionário criado com sucesso:', result);
      } else {
        console.log('❌ Erro na criação do funcionário:', result);
      }

    } catch (error) {
      console.log('❌ Erro no teste do funcionário:', error);
    }
  } else {
    console.log('⚠️ Nenhum código de convite encontrado para testar funcionário');
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Teste 3: Verificar estrutura do banco
  console.log('📋 Teste 3: Verificar estrutura do banco');
  await verificarEstruturaBanco();
}

async function verificarTenantCriado(companyName) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tenants?name=eq.${encodeURIComponent(companyName)}`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      }
    });

    const tenants = await response.json();
    
    if (tenants.length > 0) {
      const tenant = tenants[0];
      console.log('✅ Tenant criado:', {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        invite_code_socio: tenant.invite_code_socio ? '✅ Gerado' : '❌ Não gerado',
        invite_code_funcionario: tenant.invite_code_funcionario ? '✅ Gerado' : '❌ Não gerado'
      });
    } else {
      console.log('❌ Tenant não encontrado');
    }
  } catch (error) {
    console.log('❌ Erro ao verificar tenant:', error);
  }
}

async function verificarCodigosGerados(companyName) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/invite_codes?select=*`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      }
    });

    const codes = await response.json();
    console.log('✅ Códigos de convite criados:', codes.length, 'códigos');
    
    codes.forEach(code => {
      console.log(`  - ${code.role}: ${code.code} (${code.is_used ? 'Usado' : 'Disponível'})`);
    });
  } catch (error) {
    console.log('❌ Erro ao verificar códigos:', error);
  }
}

async function buscarCodigoConvite() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/invite_codes?is_used=eq.false&role=eq.employee&limit=1`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      }
    });

    const codes = await response.json();
    return codes.length > 0 ? codes[0].code : null;
  } catch (error) {
    console.log('❌ Erro ao buscar código de convite:', error);
    return null;
  }
}

async function verificarEstruturaBanco() {
  try {
    // Verificar se a tabela invite_codes existe
    const response = await fetch(`${SUPABASE_URL}/rest/v1/invite_codes?select=count`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      }
    });

    if (response.ok) {
      console.log('✅ Tabela invite_codes existe e está acessível');
    } else {
      console.log('❌ Tabela invite_codes não existe ou não está acessível');
    }
  } catch (error) {
    console.log('❌ Erro ao verificar estrutura do banco:', error);
  }
}

// Executar o teste
testCadastroAtomico().catch(console.error);
