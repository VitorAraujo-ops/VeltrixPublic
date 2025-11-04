# Script PowerShell para deploy das Edge Functions do sistema de convites
# Execute este script na raiz do projeto

Write-Host "🚀 Iniciando deploy das Edge Functions do sistema de convites..." -ForegroundColor Cyan

# Verificar se o Supabase CLI está instalado
try {
    $null = Get-Command supabase -ErrorAction Stop
    Write-Host "✅ Supabase CLI encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI não encontrado. Instale primeiro:" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Verificar se está logado no Supabase
try {
    $null = supabase status 2>$null
    Write-Host "✅ Logado no Supabase" -ForegroundColor Green
} catch {
    Write-Host "❌ Não está logado no Supabase. Execute:" -ForegroundColor Red
    Write-Host "supabase login" -ForegroundColor Yellow
    exit 1
}

# Deploy da função validate-invite-code (atualizada)
Write-Host "📦 Deployando validate-invite-code..." -ForegroundColor Yellow
try {
    supabase functions deploy validate-invite-code
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ validate-invite-code deployada com sucesso" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro no deploy de validate-invite-code" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erro no deploy de validate-invite-code" -ForegroundColor Red
    exit 1
}

# Deploy da função mark-invite-used (nova)
Write-Host "📦 Deployando mark-invite-used..." -ForegroundColor Yellow
try {
    supabase functions deploy mark-invite-used
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ mark-invite-used deployada com sucesso" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro no deploy de mark-invite-used" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erro no deploy de mark-invite-used" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Deploy das Edge Functions concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Execute o script SQL para adicionar o campo expires_at:" -ForegroundColor White
Write-Host "   - Abra o SQL Editor no Supabase" -ForegroundColor Gray
Write-Host "   - Execute o conteúdo de add_expires_at_to_invites.sql" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Teste o sistema:" -ForegroundColor White
Write-Host "   node test_invite_flow.js" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Verifique se o componente Register.tsx está atualizado" -ForegroundColor White
Write-Host ""
Write-Host "✅ Sistema de convites pronto para uso!" -ForegroundColor Green
