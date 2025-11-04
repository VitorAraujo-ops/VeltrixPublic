#!/bin/bash

# Script para deploy das Edge Functions do sistema de convites
# Execute este script na raiz do projeto

echo "🚀 Iniciando deploy das Edge Functions do sistema de convites..."

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI não encontrado. Instale primeiro:"
    echo "npm install -g supabase"
    exit 1
fi

# Verificar se está logado no Supabase
if ! supabase status &> /dev/null; then
    echo "❌ Não está logado no Supabase. Execute:"
    echo "supabase login"
    exit 1
fi

echo "✅ Supabase CLI configurado"

# Deploy da função validate-invite-code (atualizada)
echo "📦 Deployando validate-invite-code..."
if supabase functions deploy validate-invite-code; then
    echo "✅ validate-invite-code deployada com sucesso"
else
    echo "❌ Erro no deploy de validate-invite-code"
    exit 1
fi

# Deploy da função mark-invite-used (nova)
echo "📦 Deployando mark-invite-used..."
if supabase functions deploy mark-invite-used; then
    echo "✅ mark-invite-used deployada com sucesso"
else
    echo "❌ Erro no deploy de mark-invite-used"
    exit 1
fi

echo ""
echo "🎉 Deploy das Edge Functions concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Execute o script SQL para adicionar o campo expires_at:"
echo "   - Abra o SQL Editor no Supabase"
echo "   - Execute o conteúdo de add_expires_at_to_invites.sql"
echo ""
echo "2. Teste o sistema:"
echo "   node test_invite_flow.js"
echo ""
echo "3. Verifique se o componente Register.tsx está atualizado"
echo ""
echo "✅ Sistema de convites pronto para uso!"
