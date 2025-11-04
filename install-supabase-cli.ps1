# Script para instalar o Supabase CLI no Windows
# Execute este script como Administrador

Write-Host "Instalando Supabase CLI..." -ForegroundColor Green

# URL do Supabase CLI para Windows (versão específica)
$supabaseUrl = "https://github.com/supabase/cli/releases/download/v1.145.4/supabase_windows_amd64.exe"
$localPath = "$env:LOCALAPPDATA\supabase\supabase.exe"
$installDir = "$env:LOCALAPPDATA\supabase"

# Criar diretório se não existir
if (!(Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force
    Write-Host "Diretório criado: $installDir" -ForegroundColor Yellow
}

# Download do Supabase CLI
Write-Host "Baixando Supabase CLI..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $supabaseUrl -OutFile $localPath
    Write-Host "Download concluído!" -ForegroundColor Green
} catch {
    Write-Host "Erro no download: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Adicionar ao PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($currentPath -notlike "*$installDir*") {
    [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$installDir", "User")
    Write-Host "Supabase CLI adicionado ao PATH do usuário" -ForegroundColor Green
}

# Verificar instalação
Write-Host "Verificando instalação..." -ForegroundColor Yellow
try {
    & $localPath --version
    Write-Host "Supabase CLI instalado com sucesso!" -ForegroundColor Green
    Write-Host "Reinicie o terminal para usar o comando 'supabase'" -ForegroundColor Yellow
} catch {
    Write-Host "Erro na verificação: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nPróximos passos:" -ForegroundColor Cyan
Write-Host "1. Reinicie o terminal" -ForegroundColor White
Write-Host "2. Execute: supabase login" -ForegroundColor White
Write-Host "3. Execute: supabase link --project-ref SEU_PROJECT_REF" -ForegroundColor White
Write-Host "4. Execute: supabase functions deploy invite-user" -ForegroundColor White
