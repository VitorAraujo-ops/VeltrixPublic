# Script PowerShell para deploy da Edge Function create-income-receivable
# Execute este script na raiz do projeto

Write-Host "🚀 Iniciando deploy da Edge Function create-income-receivable..." -ForegroundColor Cyan

# Verificar se o Supabase CLI está instalado
try {
    $null = Get-Command supabase -ErrorAction Stop
    Write-Host "✅ Supabase CLI encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI não encontrado. Instale primeiro:" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Yellow
    Write-Host "Ou execute: powershell -ExecutionPolicy Bypass -File install-supabase-cli.ps1" -ForegroundColor Yellow
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

# Deploy da função create-income-receivable
Write-Host "📦 Deployando create-income-receivable..." -ForegroundColor Yellow
try {
    supabase functions deploy create-income-receivable
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ create-income-receivable deployada com sucesso" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro no deploy de create-income-receivable" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erro no deploy de create-income-receivable" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Deploy da Edge Function concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Aplicar migração do banco de dados:" -ForegroundColor White
Write-Host "   supabase db reset --linked" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Testar a API no frontend:" -ForegroundColor White
Write-Host "   - Acesse a aba 'Contas a Receber'" -ForegroundColor Gray
Write-Host "   - Clique em '+ Nova Conta a Receber'" -ForegroundColor Gray
Write-Host "   - Preencha o formulário e teste" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Verificar logs da função:" -ForegroundColor White
Write-Host "   supabase functions logs create-income-receivable" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ API de Contas a Receber pronta para uso!" -ForegroundColor Green























