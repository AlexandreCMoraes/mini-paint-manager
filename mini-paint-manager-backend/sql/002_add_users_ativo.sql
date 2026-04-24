-- Adiciona coluna para controle de ativação de conta de usuário
ALTER TABLE users
ADD COLUMN IF NOT EXISTS ativo BOOLEAN;

-- Garante valor padrão para novos registros
ALTER TABLE users
ALTER COLUMN ativo SET DEFAULT TRUE;

-- Preenche usuários legados que ainda não possuem valor definido
UPDATE users
SET ativo = TRUE
WHERE ativo IS NULL;

-- Garante que a coluna sempre tenha valor
ALTER TABLE users
ALTER COLUMN ativo SET NOT NULL;
