ALTER TABLE users
ADD COLUMN IF NOT EXISTS reactivation_token TEXT NULL,
ADD COLUMN IF NOT EXISTS reactivation_token_expires_at TIMESTAMP NULL;
