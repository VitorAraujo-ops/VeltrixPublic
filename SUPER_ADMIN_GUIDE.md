# Guia do Super Admin - Painel Veltrix

## Visão Geral

O Painel Veltrix é uma funcionalidade exclusiva para utilizadores com o papel `super_admin`. Este painel permite administrar todo o sistema, visualizar estatísticas globais e gerir empresas e utilizadores.

## Funcionalidades Implementadas

### 1. Navegação e Acesso

- **Acesso Restrito**: Apenas utilizadores com `role === 'super_admin'` podem acessar
- **Link na Sidebar**: "Painel Veltrix" aparece na barra lateral apenas para super admins
- **Navegação Dual**: Permite alternar entre o dashboard da empresa e o painel administrativo

### 2. Visão Geral (Overview)

Exibe estatísticas globais do sistema:

- **Total de Empresas**: Número de tenants registados
- **Total de Utilizadores**: Todos os utilizadores do sistema
- **Proprietários**: Utilizadores com papel 'owner'
- **Funcionários**: Utilizadores com papel 'employee'

**Funcionalidades:**
- Atualização em tempo real
- Cálculo automático de médias e percentagens
- Interface responsiva com cards visuais

### 3. Empresas e Utilizadores

Lista detalhada de todas as empresas e seus utilizadores:

- **Busca Avançada**: Pesquisa por nome da empresa, slug, nome ou email do utilizador
- **Expansão de Detalhes**: Clique para ver todos os utilizadores de uma empresa
- **Informações Detalhadas**: 
  - Nome e slug da empresa
  - Data de criação
  - Lista de utilizadores com roles e dados de contacto
  - Formatação de datas em português

## Estrutura de Arquivos

```
src/components/SuperAdmin/
├── SuperAdminPage.tsx      # Componente principal
├── AdminOverview.tsx       # Visão geral com estatísticas
└── ClientListView.tsx      # Lista de empresas e utilizadores
```

## Funções RPC do Supabase

As seguintes funções foram criadas no Supabase:

### 1. `get_total_tenants_count()`
- **Retorna**: Número total de empresas
- **Uso**: Estatísticas gerais

### 2. `get_total_users_count()`
- **Retorna**: Número total de utilizadores
- **Uso**: Estatísticas gerais

### 3. `get_total_owners_count()`
- **Retorna**: Número de proprietários
- **Uso**: Cálculo de funcionários (total - proprietários)

### 4. `get_all_tenants_with_users()`
- **Retorna**: Todas as empresas com seus utilizadores em JSON
- **Estrutura**:
  ```json
  {
    "id": "uuid",
    "name": "Nome da Empresa",
    "slug": "slug-da-empresa",
    "created_at": "2024-12-01T00:00:00Z",
    "users": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "name": "Nome do Utilizador",
        "role": "owner|employee|super_admin",
        "user_type": "PF|PJ",
        "phone": "telefone",
        "created_at": "2024-12-01T00:00:00Z"
      }
    ]
  }
  ```

## Implementação Técnica

### 1. Modificações no DashboardApp.tsx

- Adicionado estado `activeView` para controlar a navegação
- Lógica condicional para renderizar `SuperAdminPage`
- Passagem de props para a Sidebar

### 2. Modificações na Sidebar.tsx

- Adicionado link "Painel Veltrix" visível apenas para super_admin
- Navegação entre dashboard da empresa e painel administrativo
- Ícone Shield para identificar a funcionalidade

### 3. Componentes Criados

#### SuperAdminPage.tsx
- Container principal com navegação de abas
- Estados para controlar a vista ativa
- Renderização condicional dos componentes

#### AdminOverview.tsx
- Busca estatísticas via RPC
- Cards visuais com gradientes
- Tratamento de loading e erros
- Cálculos automáticos de métricas

#### ClientListView.tsx
- Lista expansível de empresas
- Busca em tempo real
- Formatação de dados
- Interface responsiva

## Segurança

### Controle de Acesso
- Verificação de `user.role === 'super_admin'` em todos os componentes
- Funções RPC com `SECURITY DEFINER` para acesso privilegiado
- Validação no frontend e backend

### Dados Sensíveis
- Apenas dados necessários são expostos
- Sem acesso a senhas ou dados financeiros
- Logs de auditoria mantidos

## Como Usar

### 1. Acesso ao Painel
1. Faça login como super_admin
2. Clique em "Painel Veltrix" na barra lateral
3. O painel abrirá com a aba "Visão Geral" ativa

### 2. Navegação
- **Visão Geral**: Estatísticas do sistema
- **Empresas e Utilizadores**: Lista detalhada

### 3. Funcionalidades
- **Atualizar**: Botão para recarregar dados
- **Buscar**: Campo de pesquisa na lista de empresas
- **Expandir**: Clique para ver utilizadores de uma empresa

## Próximas Funcionalidades

### Planeadas para Futuras Versões:
- [ ] Gestão de utilizadores (criar, editar, desativar)
- [ ] Gestão de empresas (ativar/desativar tenants)
- [ ] Logs de auditoria
- [ ] Relatórios avançados
- [ ] Configurações do sistema
- [ ] Backup e restauração

## Troubleshooting

### Problemas Comuns

1. **"Erro ao buscar estatísticas"**
   - Verificar se as funções RPC foram criadas no Supabase
   - Executar o script SQL de migração

2. **"Acesso Restrito"**
   - Verificar se o utilizador tem `role === 'super_admin'`
   - Verificar se está logado corretamente

3. **Dados não aparecem**
   - Verificar conexão com Supabase
   - Verificar se existem dados na base de dados

### Logs de Debug
- Abrir console do navegador para ver logs detalhados
- Verificar Network tab para chamadas RPC
- Verificar se as funções retornam dados corretos

## Migração de Base de Dados

Execute o seguinte script no SQL Editor do Supabase:

```sql
-- Executar o arquivo: supabase/migrations/20241201000001_create_admin_functions.sql
```

Este script cria todas as funções RPC necessárias para o funcionamento do painel.

## Conclusão

O Painel Veltrix fornece uma interface completa para administração do sistema, permitindo aos super admins monitorizar e gerir todas as empresas e utilizadores de forma eficiente e segura.
