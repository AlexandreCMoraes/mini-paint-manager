const pool = require('../db');

// Verifica se já existe um usuário com o mesmo username ou email
const findDuplicatesByUsernameOrEmail = async ({ username, email }) => {
    const result = await pool.query(
        'SELECT username, email FROM users WHERE username = $1 OR email = $2',
        [username, email]
    );
    return result.rows;
};

// Cria um usuário
const createUser = async ({ username, email, passwordHash }) => {
    const result = await pool.query(
        `INSERT INTO users (username, email, password_hash, created_at)
     VALUES ($1, $2, $3, NOW())
     RETURNING id, username, email, created_at`,
        [username, email, passwordHash]
    );
    return result.rows[0] || null;
};

// Busca um usuário para login usando o username
const findUserForLoginByUsername = async (username) => {
    const result = await pool.query(
        'SELECT id, username, email, password_hash, created_at, ativo, deletado_em FROM users WHERE username = $1 LIMIT 1',
        [username]
    );
    return result.rows[0] || null;
};

// Busca o ID do usuário pelo email
const findUserIdByEmail = async (email) => {
    const result = await pool.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [email]);
    return result.rows[0] || null;
};

// Reativa um usuário e atualiza a senha
const reactivateUserAndUpdatePassword = async ({ email, passwordHash }) => {
    await pool.query(
        `UPDATE users
     SET password_hash = $1,
         ativo = true,
         deletado_em = NULL,
         reactivation_token = NULL,
         reactivation_token_expires_at = NULL
     WHERE email = $2`,
        [passwordHash, email]
    );
};

// Busca um usuário para reativação usando o email
const findUserForReactivationByEmail = async (email) => {
    const result = await pool.query(
        'SELECT id, username, email FROM users WHERE email = $1 LIMIT 1',
        [email]
    );
    return result.rows[0] || null;
};

// Salva o token de reativação e sua data de expiração para um usuário
const saveReactivationToken = async ({ userId, token, expiresAt }) => {
    await pool.query(
        `UPDATE users
     SET reactivation_token = $1,
         reactivation_token_expires_at = $2
     WHERE id = $3`,
        [token, expiresAt, userId]
    );
};

module.exports = {
    findDuplicatesByUsernameOrEmail,
    createUser,
    findUserForLoginByUsername,
    findUserIdByEmail,
    reactivateUserAndUpdatePassword,
    findUserForReactivationByEmail,
    saveReactivationToken,
};
