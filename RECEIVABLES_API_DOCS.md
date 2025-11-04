# API de Contas a Receber - Documentação

## Visão Geral

Esta documentação descreve a implementação da API para gerenciar contas a receber no sistema Veltrix.

## Estrutura do Banco de Dados

### Tabela: `income_receivables`

```sql
CREATE TABLE income_receivables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    client VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    paid_at TIMESTAMP WITH TIME ZONE,
    paid_amount DECIMAL(15,2) DEFAULT 0
);
```

## Endpoint da API

### POST `/functions/v1/create-income-receivable`

Cria uma nova conta a receber.

#### Headers Obrigatórios
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Body da Requisição
```json
{
  "client": "Nome do cliente ou empresa",
  "description": "Descrição da venda ou serviço",
  "category": "venda-produto", // Opcional
  "amount": 1500.00,
  "due_date": "2024-12-31",
  "notes": "Informações adicionais" // Opcional
}
```

#### Campos Obrigatórios
- `client`: Nome do cliente (string)
- `description`: Descrição da venda/serviço (string)
- `amount`: Valor em reais (number)
- `due_date`: Data de vencimento (string no formato YYYY-MM-DD)

#### Campos Opcionais
- `category`: Categoria da conta
  - `venda-produto`: Venda de Produto
  - `prestacao-servico`: Prestação de Serviço
  - `consultoria`: Consultoria
  - `outros`: Outros
- `notes`: Observações adicionais

#### Resposta de Sucesso (201)
```json
{
  "success": true,
  "data": {
    "id": "uuid-da-conta",
    "tenant_id": "uuid-do-tenant",
    "client": "Nome do cliente",
    "description": "Descrição da venda",
    "category": "venda-produto",
    "amount": 1500.00,
    "due_date": "2024-12-31",
    "status": "pending",
    "notes": "Observações",
    "created_at": "2024-12-01T10:00:00Z",
    "updated_at": "2024-12-01T10:00:00Z",
    "created_by": "uuid-do-usuario"
  },
  "message": "Income receivable created successfully"
}
```

#### Respostas de Erro

**400 Bad Request** - Dados inválidos
```json
{
  "error": "Missing required fields",
  "missingFields": ["client", "amount"]
}
```

**401 Unauthorized** - Token inválido
```json
{
  "error": "Invalid authentication token"
}
```

**500 Internal Server Error** - Erro do servidor
```json
{
  "error": "Internal server error",
  "details": "Mensagem de erro específica"
}
```

## Segurança

- **Autenticação**: Todas as requisições devem incluir um token JWT válido
- **Autorização**: Usuários só podem criar contas a receber para sua própria empresa (tenant)
- **RLS**: Row Level Security está habilitado na tabela
- **Validação**: Validação rigorosa de todos os campos obrigatórios

## Frontend Integration

O componente `ReceivableAccounts.tsx` foi atualizado para:

1. **Gerenciar estado do formulário** com React hooks
2. **Validar dados** antes do envio
3. **Fazer requisições autenticadas** para a API
4. **Exibir feedback** de sucesso/erro para o usuário
5. **Resetar formulário** após sucesso

### Exemplo de Uso no Frontend

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const response = await fetch(`${VITE_SUPABASE_URL}/functions/v1/create-income-receivable`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(formData),
  });

  const result = await response.json();
  
  if (response.ok) {
    // Sucesso - atualizar UI
  } else {
    // Erro - exibir mensagem
  }
};
```

## Deploy

Para aplicar as mudanças:

1. **Aplicar migração do banco**:
   ```bash
   supabase db reset --linked
   ```

2. **Deploy da Edge Function**:
   ```bash
   supabase functions deploy create-income-receivable
   ```

3. **Verificar funcionamento**:
   - Testar criação de conta a receber no frontend
   - Verificar dados na tabela `income_receivables`
   - Confirmar logs da Edge Function

## Próximos Passos

1. **Implementar listagem** de contas a receber
2. **Adicionar funcionalidade** de edição/exclusão
3. **Implementar filtros** e busca
4. **Adicionar relatórios** de contas a receber
5. **Implementar notificações** de vencimento























