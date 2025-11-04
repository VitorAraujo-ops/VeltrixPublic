# Instruções para Deploy da Edge Function

## Funcionalidade Implementada

✅ **Frontend (CompanyDashboard.tsx)**: 
- Seção "Gestão de Equipe" visível apenas para proprietários
- Formulário com campo de email e botão "Adicionar Funcionário"
- Validação de email e feedback visual
- Integração com a Edge Function `invite-user`

✅ **Backend (Edge Function)**:
- Arquivo criado em `supabase/functions/invite-user/index.ts`
- Validação de permissões (apenas owners podem convidar)
- Verificação de email existente
- Configuração de metadados para associar funcionário à empresa
- Criação automática do registro na tabela `users`

## Como Fazer o Deploy

### Opção 1: Usando Supabase CLI (Recomendado)

1. **Instalar Supabase CLI**:
   ```bash
   # Windows (PowerShell como Administrador)
   npm install -g supabase
   
   # Ou usando o instalador direto
   powershell -Command "iwr https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.exe -OutFile supabase.exe"
   ```

2. **Fazer login no Supabase**:
   ```bash
   supabase login
   ```

3. **Conectar ao projeto**:
   ```bash
   supabase link --project-ref SEU_PROJECT_REF
   ```

4. **Deploy da função**:
   ```bash
   supabase functions deploy invite-user
   ```

### Opção 2: Deploy Manual via Dashboard

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Navegue até seu projeto
3. Vá para **Edge Functions** no menu lateral
4. Clique em **Create a new function**
5. Nome da função: `invite-user`
6. Runtime: `Deno`
7. Cole o conteúdo do arquivo `supabase/functions/invite-user/index.ts`
8. Clique em **Deploy**

### Opção 3: Usando GitHub Actions (Se disponível)

Se você tiver GitHub Actions configurado, pode adicionar este workflow:

```yaml
name: Deploy Supabase Functions
on:
  push:
    branches: [main]
    paths: ['supabase/functions/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/setup-cli@v1
      - run: supabase functions deploy invite-user
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
```

## Configuração Necessária

### Variáveis de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas no seu projeto Supabase:

- `SUPABASE_URL`: URL do seu projeto
- `SUPABASE_ANON_KEY`: Chave anônima
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço (para operações admin)

### Permissões de RLS

A Edge Function usa o cliente admin, então não precisa de configurações especiais de RLS.

## Testando a Funcionalidade

1. Faça login como um usuário com role `owner`
2. Navegue para o dashboard da empresa
3. Na seção "Gestão de Equipe", insira um email válido
4. Clique em "Adicionar Funcionário"
5. Verifique se o convite foi enviado

## Estrutura de Arquivos

```
project/
├── src/
│   └── components/
│       └── Dashboard/
│           └── CompanyDashboard.tsx  # ✅ Implementado
└── supabase/
    ├── config.toml                   # ✅ Criado
    └── functions/
        └── invite-user/
            └── index.ts              # ✅ Criado
```

## Funcionalidades da Edge Function

- ✅ Validação de autenticação
- ✅ Verificação de permissões (apenas owners)
- ✅ Validação de formato de email
- ✅ Verificação de usuário existente
- ✅ Envio de convite com metadados
- ✅ Criação automática do registro na tabela `users`
- ✅ Tratamento de erros
- ✅ Headers CORS configurados

## Próximos Passos

Após o deploy, você pode:

1. Testar a funcionalidade com um email real
2. Personalizar o template de email do convite
3. Adicionar notificações em tempo real
4. Implementar listagem de funcionários convidados
5. Adicionar funcionalidade de remoção de funcionários
