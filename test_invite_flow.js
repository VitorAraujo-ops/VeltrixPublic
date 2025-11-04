// Script de teste para o fluxo completo de convites
// Execute este script para testar a funcionalidade

const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (substitua pelas suas credenciais)
const supabaseUrl = process.env.SUPABASE_URL || 'SUA_URL_AQUI';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'SUA_CHAVE_AQUI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInviteFlow() {
  console.log('🧪 Iniciando teste do fluxo de convites...\n');

  try {
    // 1. Testar validação de código inválido
    console.log('1️⃣ Testando validação de código inválido...');
    const { data: invalidData, error: invalidError } = await supabase.functions.invoke('validate-invite-code', {
      body: { inviteCode: 'CODIGO_INVALIDO' }
    });
    
    if (invalidError) {
      console.log('❌ Erro na validação:', invalidError.message);
    } else if (invalidData.error) {
      console.log('✅ Código inválido rejeitado corretamente:', invalidData.error);
    }

    // 2. Verificar se existem convites na base
    console.log('\n2️⃣ Verificando convites existentes...');
    const { data: invites, error: invitesError } = await supabase
      .from('invites')
      .select(`
        id,
        invite_code,
        role,
        tenant_id,
        used,
        expires_at,
        tenants (
          name
        )
      `)
      .eq('used', false)
      .limit(1);

    if (invitesError) {
      console.log('❌ Erro ao buscar convites:', invitesError.message);
      return;
    }

    if (!invites || invites.length === 0) {
      console.log('⚠️ Nenhum convite não utilizado encontrado. Crie um convite primeiro.');
      return;
    }

    const testInvite = invites[0];
    console.log('✅ Convite encontrado:', {
      id: testInvite.id,
      code: testInvite.invite_code,
      role: testInvite.role,
      tenant: testInvite.tenants?.name,
      expires: testInvite.expires_at
    });

    // 3. Testar validação de código válido
    console.log('\n3️⃣ Testando validação de código válido...');
    const { data: validData, error: validError } = await supabase.functions.invoke('validate-invite-code', {
      body: { inviteCode: testInvite.invite_code }
    });

    if (validError) {
      console.log('❌ Erro na validação:', validError.message);
    } else if (validData.success) {
      console.log('✅ Código válido aceito:', {
        role: validData.invite.role,
        tenant: validData.invite.tenant_name,
        tenant_id: validData.invite.tenant_id
      });
    } else {
      console.log('❌ Validação falhou:', validData.error);
    }

    // 4. Testar marcação como usado (simulação)
    console.log('\n4️⃣ Testando marcação como usado...');
    const { data: markData, error: markError } = await supabase.functions.invoke('mark-invite-used', {
      body: {
        inviteId: testInvite.id,
        userId: '00000000-0000-0000-0000-000000000000' // UUID de teste
      }
    });

    if (markError) {
      console.log('❌ Erro ao marcar como usado:', markError.message);
    } else if (markData.success) {
      console.log('✅ Convite marcado como usado com sucesso');
    } else {
      console.log('❌ Falha ao marcar como usado:', markData.error);
    }

    // 5. Verificar se o convite foi marcado como usado
    console.log('\n5️⃣ Verificando status do convite...');
    const { data: updatedInvite, error: checkError } = await supabase
      .from('invites')
      .select('used, used_by, used_at')
      .eq('id', testInvite.id)
      .single();

    if (checkError) {
      console.log('❌ Erro ao verificar convite:', checkError.message);
    } else {
      console.log('✅ Status do convite:', {
        used: updatedInvite.used,
        used_by: updatedInvite.used_by,
        used_at: updatedInvite.used_at
      });
    }

    console.log('\n🎉 Teste do fluxo de convites concluído!');

  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
  }
}

// Executar o teste se o script for chamado diretamente
if (require.main === module) {
  testInviteFlow();
}

module.exports = { testInviteFlow };
