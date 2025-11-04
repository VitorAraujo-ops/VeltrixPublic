# 🔧 Correção de CORS - Edge Function create-income-receivable

## ✅ Problema Resolvido

A Edge Function `create-income-receivable` foi corrigida para resolver o problema de CORS. As seguintes melhorias foram implementadas:

### 🔧 Correções Aplicadas

1. **Cabeçalhos CORS Completos**:
   ```typescript
   const corsHeaders = {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
     'Access-Control-Allow-Methods': 'POST, OPTIONS',
   }
   ```

2. **Tratamento Prioritário de OPTIONS**:
   ```typescript
   // Handle CORS preflight requests FIRST - before any other logic
   if (req.method === 'OPTIONS') {
     return new Response('ok', { 
       status: 200,
       headers: corsHeaders 
     })
   }
   ```

3. **Cabeçalhos CORS em Todas as Respostas**:
   - Todas as respostas (sucesso e erro) agora incluem os cabeçalhos CORS
   - Status codes apropriados para cada tipo de resposta

## 🚀 Como Fazer o Deploy

### Opção 1: Via Supabase CLI (Recomendado)

1. **Instalar Supabase CLI**:
   ```bash
   # Windows (PowerShell como Administrador)
   winget install Supabase.cli
   
   # Ou baixar manualmente de:
   # https://github.com/supabase/cli/releases
   ```

2. **Login no Supabase**:
   ```bash
   supabase login
   ```

3. **Linkar ao projeto**:
   ```bash
   supabase link --project-ref SEU_PROJECT_REF
   ```

4. **Deploy da função**:
   ```bash
   supabase functions deploy create-income-receivable
   ```

### Opção 2: Via Dashboard do Supabase

1. **Acesse o Dashboard do Supabase**
2. **Vá para Edge Functions**
3. **Crie uma nova função** chamada `create-income-receivable`
4. **Cole o código** do arquivo `supabase/functions/create-income-receivable/index.ts`
5. **Salve e faça deploy**

### Opção 3: Via Script PowerShell

Execute o script criado:
```powershell
powershell -ExecutionPolicy Bypass -File deploy-receivables-function.ps1
```

## 🧪 Testando a Correção

### 1. Teste de CORS (Preflight)
```bash
curl -X OPTIONS \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: authorization,content-type" \
  https://SEU_PROJECT_REF.supabase.co/functions/v1/create-income-receivable
```

**Resposta esperada**:
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type
Access-Control-Allow-Methods: POST, OPTIONS
```

### 2. Teste da API (POST)
```bash
curl -X POST \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client": "Cliente Teste",
    "description": "Teste de API",
    "amount": 100.00,
    "due_date": "2024-12-31"
  }' \
  https://SEU_PROJECT_REF.supabase.co/functions/v1/create-income-receivable
```

### 3. Teste no Frontend

1. **Acesse a aba "Contas a Receber"**
2. **Clique em "+ Nova Conta a Receber"**
3. **Preencha o formulário**:
   - Cliente: "Cliente Teste"
   - Descrição: "Teste de integração"
   - Valor: 150.00
   - Data de Vencimento: 31/12/2024
4. **Clique em "Adicionar Recebimento"**
5. **Verifique** se aparece mensagem de sucesso

## 🔍 Verificando se Funcionou

### Console do Navegador
- **Antes**: Erro de CORS com status não-OK
- **Depois**: Requisição bem-sucedida ou erro de validação (não CORS)

### Network Tab
- **OPTIONS request**: Status 200 com cabeçalhos CORS
- **POST request**: Status 201 (sucesso) ou 400/401 (validação)

### Logs da Edge Function
```bash
supabase functions logs create-income-receivable
```

## 📋 Checklist de Verificação

- [ ] Edge Function deployada com sucesso
- [ ] Migração do banco aplicada (`income_receivables` table)
- [ ] Teste de OPTIONS retorna 200 OK
- [ ] Teste de POST funciona com dados válidos
- [ ] Frontend consegue fazer requisições sem erro de CORS
- [ ] Dados são salvos na tabela `income_receivables`

## 🆘 Solução de Problemas

### Erro: "Function not found"
- Verifique se a função foi deployada corretamente
- Confirme o nome da função: `create-income-receivable`

### Erro: "CORS still failing"
- Verifique se os cabeçalhos CORS estão sendo retornados
- Teste com curl para confirmar se é problema do navegador

### Erro: "Database table not found"
- Aplique a migração: `supabase db reset --linked`
- Verifique se a tabela `income_receivables` existe

### Erro: "Authentication failed"
- Verifique se o token JWT é válido
- Confirme se o usuário está logado no frontend

## ✅ Status da Implementação

- [x] Correção de CORS implementada
- [x] Cabeçalhos CORS completos
- [x] Tratamento de OPTIONS prioritário
- [x] Scripts de deploy criados
- [x] Documentação completa
- [ ] Deploy da função (pendente)
- [ ] Teste de integração (pendente)

**A correção de CORS está pronta! Agora é necessário fazer o deploy da função para resolver o problema.**
