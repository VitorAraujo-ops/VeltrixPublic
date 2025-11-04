-- =============================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS PARA TENANTS
-- =============================================

-- Usuários podem ver apenas seu próprio tenant
CREATE POLICY "Users can view own tenant" ON tenants
    FOR SELECT USING (
        id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid()
        )
    );

-- Apenas owners podem atualizar tenant
CREATE POLICY "Only owners can update tenant" ON tenants
    FOR UPDATE USING (
        id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- =============================================
-- POLÍTICAS PARA USERS
-- =============================================

-- Usuários podem ver outros usuários do mesmo tenant
CREATE POLICY "Users can view same tenant users" ON users
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid()
        )
    );

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (id = auth.uid());

-- =============================================
-- POLÍTICAS PARA FINANCIAL_ENTRIES
-- =============================================

-- Usuários podem ver lançamentos do seu tenant
CREATE POLICY "Users can view tenant financial entries" ON financial_entries
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid()
        )
    );

-- Usuários podem inserir lançamentos no seu tenant
CREATE POLICY "Users can insert financial entries" ON financial_entries
    FOR INSERT WITH CHECK (
        tenant_id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid()
        )
    );

-- Apenas owners/sócios podem atualizar/deletar
CREATE POLICY "Owners can update financial entries" ON financial_entries
    FOR UPDATE USING (
        tenant_id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid() AND role IN ('owner', 'socio')
        )
    );

CREATE POLICY "Owners can delete financial entries" ON financial_entries
    FOR DELETE USING (
        tenant_id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid() AND role IN ('owner', 'socio')
        )
    );

-- =============================================
-- POLÍTICAS PARA INVITE_CODES
-- =============================================

-- Usuários podem ver convites do seu tenant
CREATE POLICY "Users can view tenant invite codes" ON invite_codes
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid()
        )
    );

-- Apenas owners podem criar convites
CREATE POLICY "Owners can create invite codes" ON invite_codes
    FOR INSERT WITH CHECK (
        tenant_id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- =============================================
-- POLÍTICAS PARA USER_PERMISSIONS
-- =============================================

-- Usuários podem ver permissões do mesmo tenant
CREATE POLICY "Users can view tenant permissions" ON user_permissions
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM users 
            WHERE tenant_id IN (
                SELECT tenant_id FROM users 
                WHERE id = auth.uid()
            )
        )
    );

-- Apenas owners podem gerenciar permissões
CREATE POLICY "Owners can manage permissions" ON user_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'owner'
            AND tenant_id IN (
                SELECT tenant_id FROM users 
                WHERE id = user_permissions.user_id
            )
        )
    );
