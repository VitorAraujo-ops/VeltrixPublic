// Teste de integração da aba Metas com Supabase
// Este arquivo pode ser executado para testar se a conexão está funcionando

import { supabase } from './src/lib/supabase';

async function testGoalsIntegration() {
  console.log('🧪 Testando integração da aba Metas com Supabase...');

  try {
    // 1. Testar conexão com Supabase
    console.log('1. Testando conexão com Supabase...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Erro de autenticação:', authError);
      return;
    }

    if (!user) {
      console.log('⚠️ Usuário não autenticado. Faça login primeiro.');
      return;
    }

    console.log('✅ Usuário autenticado:', user.email);

    // 2. Testar busca de metas
    console.log('2. Testando busca de metas...');
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (goalsError) {
      console.error('❌ Erro ao buscar metas:', goalsError);
      return;
    }

    console.log('✅ Metas encontradas:', goals?.length || 0);

    // 3. Testar criação de meta (se não houver metas)
    if (!goals || goals.length === 0) {
      console.log('3. Testando criação de meta...');
      
      const testGoal = {
        category: 'all',
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        target: 10000.00,
        type: 'income'
      };

      const { data: newGoal, error: createError } = await supabase
        .from('goals')
        .insert(testGoal)
        .select()
        .single();

      if (createError) {
        console.error('❌ Erro ao criar meta:', createError);
        return;
      }

      console.log('✅ Meta criada com sucesso:', newGoal);

      // 4. Testar atualização de meta
      console.log('4. Testando atualização de meta...');
      const { data: updatedGoal, error: updateError } = await supabase
        .from('goals')
        .update({ target: 15000.00 })
        .eq('id', newGoal.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Erro ao atualizar meta:', updateError);
        return;
      }

      console.log('✅ Meta atualizada com sucesso:', updatedGoal);

      // 5. Testar exclusão de meta
      console.log('5. Testando exclusão de meta...');
      const { error: deleteError } = await supabase
        .from('goals')
        .delete()
        .eq('id', newGoal.id);

      if (deleteError) {
        console.error('❌ Erro ao deletar meta:', deleteError);
        return;
      }

      console.log('✅ Meta deletada com sucesso');
    }

    console.log('🎉 Todos os testes passaram! A integração está funcionando corretamente.');

  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
  }
}

// Executar o teste se este arquivo for executado diretamente
if (typeof window !== 'undefined') {
  // No navegador, adicionar ao window para facilitar testes
  (window as any).testGoalsIntegration = testGoalsIntegration;
  console.log('💡 Execute testGoalsIntegration() no console para testar a integração');
} else {
  // Em Node.js, executar diretamente
  testGoalsIntegration();
}

export { testGoalsIntegration };









