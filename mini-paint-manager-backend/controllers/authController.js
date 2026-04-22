const bcrypt = require('bcryptjs'); // bcryptjs para compatibilidade total com Node.js, sem dependências nativas
const jwt = require('jsonwebtoken'); // jsonwebtoken para criação e verificação de tokens JWT
const pool = require('../db'); // Configurações de segurança

const SALT_ROUNDS = 10; // Número de rounds para hashing de senha, balanceando segurança e desempenho

// Função para criar um token JWT com as informações do usuário
const createToken = (user) => jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);
// Função para sanitizar os dados do usuário antes de enviá-los na resposta, removendo informações sensíveis como o hash da senha
const sanitizeUser = (userRow) => ({
    id: userRow.id,
    username: userRow.username,
    email: userRow.email,
    created_at: userRow.created_at,
});

// Controlador de autenticação que lida com o registro e login de usuários. Ele inclui validação de 
// entrada, verificação de duplicatas, hashing de senhas e geração de tokens JWT para 
// autenticação. O controlador também retorna mensagens de erro apropriadas para diferentes 
// cenários, como campos ausentes, credenciais inválidas ou conflitos de usuário existente.
const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'username, email e password são obrigatórios' });
    }

    try {
        const duplicateCheck = await pool.query(
            'SELECT username, email FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (duplicateCheck.rowCount > 0) {
            const hasUsername = duplicateCheck.rows.some((row) => row.username === username);
            const hasEmail = duplicateCheck.rows.some((row) => row.email === email);

            if (hasUsername) {
                return res.status(409).json({ message: 'Username já está em uso' });
            }

            if (hasEmail) {
                return res.status(409).json({ message: 'Email já está em uso' });
            }
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, username, email, created_at`,
            [username, email, passwordHash]
        );

        const user = result.rows[0];
        const token = createToken(user);

        return res.status(201).json({
            message: 'Usuário cadastrado com sucesso',
            user: sanitizeUser(user),
            token,
        });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);

        if (error.code === '23505') {
            if (error.constraint && error.constraint.includes('username')) {
                return res.status(409).json({ message: 'Username já está em uso' });
            }
            if (error.constraint && error.constraint.includes('email')) {
                return res.status(409).json({ message: 'Email já está em uso' });
            }
            return res.status(409).json({ message: 'Usuário já existe' });
        }

        return res.status(500).json({ message: 'Erro interno ao registrar usuário' });
    }
};

// Controlador de login que autentica o usuário verificando as credenciais fornecidas. 
// Ele consulta o banco de dados para encontrar o usuário pelo nome de usuário, compara a 
// senha fornecida com o hash armazenado usando bcrypt, e se a autenticação for bem-sucedida, 
// gera um token JWT para o usuário. O controlador também lida com erros comuns, como campos 
// ausentes, credenciais inválidas e erros internos do servidor, retornando mensagens 
// apropriadas para cada caso.
const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'username e password são obrigatórios' });
    }

    try {
        const result = await pool.query(
            'SELECT id, username, email, password_hash, created_at FROM users WHERE username = $1 LIMIT 1',
            [username]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const user = result.rows[0];
        const passwordIsValid = await bcrypt.compare(password, user.password_hash);

        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Senha inválida' });
        }

        const token = createToken(user);

        return res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            user: sanitizeUser(user),
        });
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        return res.status(500).json({ message: 'Erro interno ao autenticar usuário' });
    }
};

module.exports = {
    register,
    login,
};
