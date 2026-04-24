-- 1) Tabela de usuários para autenticação e controle de miniaturas
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2) Relacionamento com miniaturas para vincular cada miniatura a um usuário específico
ALTER TABLE miniaturas
ADD COLUMN IF NOT EXISTS user_id INTEGER;

-- Para bases já existentes sem user_id, vincula ao primeiro usuário cadastrado 
--(ajuste manual se necessário)
UPDATE miniaturas
SET user_id = (SELECT id FROM users ORDER BY id ASC LIMIT 1)
WHERE user_id IS NULL;

ALTER TABLE miniaturas
ALTER COLUMN user_id SET NOT NULL;

-- Adiciona a constraint de chave estrangeira para garantir integridade referencial
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'miniaturas_user_id_fkey'
  ) THEN
    ALTER TABLE miniaturas
    ADD CONSTRAINT miniaturas_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE;
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_miniaturas_user_id ON miniaturas(user_id);

-- 3) Coluna para controle de última modificação das miniaturas, para ordenação por 
--atividade recente
ALTER TABLE miniaturas
ADD COLUMN IF NOT EXISTS data_modificacao TIMESTAMP NULL;

CREATE INDEX IF NOT EXISTS idx_miniaturas_data_modificacao ON miniaturas(data_modificacao);
