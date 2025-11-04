-- =============================================
-- LIMPAR DADOS DUPLICADOS PARA TESTE
-- =============================================

-- Remover tenant com slug 'veltrix' (se existir)
DELETE FROM tenants WHERE slug = 'veltrix';

-- Remover tenant com documento '052.492.965-30' (se existir)
DELETE FROM tenants WHERE document = '052.492.965-30';

-- Remover usuário com email 'henriquegomes2605@outlook.com' (se existir)
DELETE FROM auth.users WHERE email = 'henriquegomes2605@outlook.com';

-- Verificar se foi removido
SELECT 'Tenants restantes:' as info;
SELECT id, name, slug, document, email FROM tenants;

SELECT 'Usuários auth restantes:' as info;
SELECT id, email FROM auth.users;
