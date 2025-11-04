// Script de teste para a Edge Function create-full-user
// Execute este script para testar se a Edge Function está funcionando

const SUPABASE_URL = 'https://tvjjwmwuwheiiqvugbak.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2amp3bXd1d2hlaWlxdnVnYmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NDUwOTQsImV4cCI6MjA3MTEyMTA5NH0.cbwP4j3vF9JER4c54oNRuekOsIxHSUvlHiAUY_XH1zE';

async function testEdgeFunction() {
  console.log('🧪 Testando Edge Function create-full-user...');
  
  // Teste com email que já existe
  const testData = {
    email: 'mineirinhopeixemarisco@gmail.com',
    name: 'Mineirinho Peixe Marisco',
    phone: '33988990791',
    userRole: 'owner',
    userType: 'PJ',
    companyName: 'Mineirinho Peixe Marisco',
    document: '30.444.358/0001-74',
    password: 'Peixaria510',
    inviteCode: ''
  };

  console.log('📤 Dados sendo enviados:', testData);

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-full-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify(testData)
    });

    console.log('📊 Status da resposta:', response.status);
    console.log('📋 Headers da resposta:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📄 Resposta completa (texto):', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('📄 Resposta parseada:', responseData);
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse da resposta JSON:', parseError);
      console.log('📄 Resposta não é JSON válido:', responseText);
    }

    if (response.ok) {
      console.log('✅ Teste bem-sucedido!');
    } else {
      console.log('❌ Teste falhou com status:', response.status);
      if (responseData && responseData.error) {
        console.log('❌ Erro detalhado:', responseData.error);
        if (responseData.details) {
          console.log('❌ Detalhes:', responseData.details);
        }
        if (responseData.missingFields) {
          console.log('❌ Campos ausentes:', responseData.missingFields);
        }
        if (responseData.receivedValues) {
          console.log('❌ Valores recebidos:', responseData.receivedValues);
        }
      }
    }

  } catch (error) {
    console.error('❌ Erro na requisição:', error);
  }
}

// Executar o teste
testEdgeFunction();
