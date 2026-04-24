-- Adiciona coluna para marcação de deleção lógica de usuários
ALTER TABLE users
ADD COLUMN IF NOT EXISTS deletado_em TIMESTAMP NULL;
-- Garante que usuários legados que não possuem valor definido sejam marcados como não deletados