const bcrypt = require('bcryptjs'); // bcryptjs para compatibilidade total com Node.js, sem dependências nativas
const jwt = require('jsonwebtoken'); // jsonwebtoken para criação e verificação de tokens JWT
const pool = require('../db'); // Configurações de segurança
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const SALT_ROUNDS = 10; // Número de rounds para hashing de senha, balanceando segurança e desempenho
const REACTIVATION_TOKEN_EXPIRY_MS = 60 * 60 * 1000;

// Função para criar um token JWT com as informações do usuário
const createToken = (user) => jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

// Função para garantir que a variável de ambiente JWT_SECRET esteja definida, lançando um erro
//  claro se estiver ausente, para evitar falhas silenciosas na geração de tokens JWT. Essa função é 
// chamada antes de criar tokens para garantir que a configuração do servidor seja adequada para 
// autenticação segura.
const ensureJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        const error = new Error('JWT_SECRET ausente');
        error.code = 'MISSING_JWT_SECRET';
        throw error;
    }
};
// Função para sanitizar os dados do usuário antes de enviá-los na resposta, removendo informações sensíveis como o hash da senha
const sanitizeUser = (userRow) => ({
    id: userRow.id,
    username: userRow.username,
    email: userRow.email,
    created_at: userRow.created_at,
});

// Função para construir o transportador de email usando as configurações definidas nas variáveis de
//  ambiente. Ela suporta tanto a configuração de serviço SMTP pré-definida (como Gmail) quanto a 
// configuração manual de host, porta e segurança. O transportador é usado para enviar emails de
//  reativação de conta e reset de senha.
const buildMailTransporter = () => {
    const smtpService = process.env.SMTP_SERVICE;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
    const smtpUser = (process.env.SMTP_USER || '').trim();
    const smtpPass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');

    return nodemailer.createTransport({
        ...(smtpService ? { service: smtpService } : {}),
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });
};

// Função para enviar email de reativação de conta. Ela verifica se as configurações SMTP estão presentes,
//  constrói o transportador de email, e envia um email para o usuário com instruções para reativar a 
// conta. A função retorna um objeto indicando se o email foi enviado com sucesso ou se houve um erro, 
// incluindo o motivo do erro para facilitar o diagnóstico e feedback ao usuário.
const sendReactivationEmail = async ({ to, username }) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return { sent: false, reason: 'missing_smtp_config' };
    }

    const mailTransporter = buildMailTransporter();
    const loginUrl = process.env.REACTIVATION_LOGIN_URL || 'http://localhost:3000/login?forceLogin=1';

    await mailTransporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: 'Solicitação de reativação de conta',
        text: [
            'Assunto: 👋 Sentimos sua falta no Mini Paint Manager',
            '',
            `Olá, ${username}!`,
            '',
            'Notamos que sua conta foi desativada — mas suas miniaturas, cores e histórico continuam salvos com a gente.',
            'Para reativar sua conta, clique no link abaixo:',
            loginUrl,
            '',
            '🔐 Por segurança, você precisará redefinir sua senha usando a opção "Forgot Password" após acessar o sistema.',
            '💡 O que você vai recuperar ao voltar:',
            '• Suas miniaturas cadastradas  ',
            '• Suas paletas de cores personalizadas  ',
            '• Seu histórico de uso e preferências  ',
            '',
            'Se você não solicitou essa reativação, pode ignorar este email — sua conta permanecerá desativada.',
            'Esperamos te ver de volta em breve 🎨',
            '',
            ' — Mini Paint Manager'
        ].join('\n'),
    });

    return { sent: true };
};

// Função para enviar email de boas-vindas após o registro de um novo usuário. Ela verifica se as
// configurações SMTP estão presentes, constrói o transportador de email, e envia um email para o
//  novo usuário com uma mensagem de boas-vindas e instruções para começar a usar o Mini Paint Manager.
//  A função retorna um objeto indicando se o email foi enviado com sucesso ou se houve um erro, incluindo
//  o motivo do erro para facilitar o diagnóstico e feedback ao usuário.
const sendWelcomeEmail = async ({ to, username }) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return { sent: false, reason: 'missing_smtp_config' };
    }

    const mailTransporter = buildMailTransporter();
    const dashboardUrl = process.env.WELCOME_DASHBOARD_URL || 'http://localhost:3000/dashboard';

    await mailTransporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: '🎨 Bem-vindo ao Mini Paint Manager!',
        text: [
            `Olá, ${username}! 👋`,
            '',
            'Seja bem-vindo ao Mini Paint Manager — seu espaço para organizar e evoluir suas pinturas.',
            '',
            'Aqui você pode:',
            '',
            '🧩 Gerenciar suas miniaturas',
            '🎨 Criar e salvar paletas de cores',
            '📸 Acompanhar evolução das pinturas',
            '🧪 Testar combinações e técnicas',
            '',
            '---',
            '',
            '👉 Comece agora acessando:',
            dashboardUrl,
            '',
            '---',
            '',
            '💡 Dica:',
            'Para adicionar imagens e editar todos os detalhes, acesse o Dashboard.',
            '',
            '---',
            '',
            'Se precisar de ajuda, estamos por aqui!',
            '',
            'Boas pinturas 🎨🔥',
            '— Mini Paint Manager',
        ].join('\n'),
    });

    return { sent: true };
};

const getDatabaseConfigErrorMessage = (error) => {
    // Códigos comuns do PostgreSQL para falhas de conexão/configuração.
    if (error?.code === '28P01') return 'Falha de autenticação no banco (verifique DB_USER/DB_PASSWORD no .env do backend)';
    if (error?.code === '3D000') return 'Banco não encontrado (verifique DB_NAME no .env do backend)';
    if (error?.code === 'ECONNREFUSED') return 'Conexão com banco recusada (verifique DB_HOST/DB_PORT e se o PostgreSQL está ativo)';
    return null;
};

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
        ensureJwtSecret();
        const token = createToken(user);

        // Envio de email de boas-vindas após registro bem-sucedido, com tratamento de erros para garantir
        //  que falhas no envio do email não afetem a experiência de registro do usuário. O controlador 
        // tenta enviar o email e, em caso de falha, registra um aviso no console sem impedir que o usuário 
        // seja registrado com sucesso.
        try {
            await sendWelcomeEmail({ to: user.email, username: user.username });
        } catch (mailError) {
            console.warn('Falha ao enviar email de boas-vindas:', mailError?.message || mailError);
        }

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
            'SELECT id, username, email, password_hash, created_at, ativo, deletado_em FROM users WHERE username = $1 LIMIT 1',
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

        if (!user.ativo) {
            return res.status(200).json({
                message: 'Conta desativada',
                requiresReactivation: true,
                reactivatable: true,
                userId: user.id,
                deletedAt: user.deletado_em || null,
                email: user.email,
            });
        }

        ensureJwtSecret();
        const token = createToken(user);

        return res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            user: sanitizeUser(user),
        });
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        const databaseConfigErrorMessage = getDatabaseConfigErrorMessage(error);
        if (databaseConfigErrorMessage) {
            return res.status(500).json({ message: databaseConfigErrorMessage });
        }
        if (error.code === 'MISSING_JWT_SECRET') {
            return res.status(500).json({ message: 'Configuração inválida do servidor (JWT_SECRET ausente)' });
        }
        return res.status(500).json({ message: 'Erro interno ao autenticar usuário' });
    }
};

// Controlador para verificar se um email existe no sistema (usado no forgot password)
const checkEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email é obrigatório' });
    }

    try {
        const result = await pool.query(
            'SELECT id FROM users WHERE email = $1 LIMIT 1',
            [email]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Email not found' });
        }

        return res.status(200).json({ message: 'Email found' });
    } catch (error) {
        console.error('Erro ao verificar email:', error);
        return res.status(500).json({ message: 'Erro interno ao verificar email' });
    }
};

// Controlador para reset de senha (forgot password)
const forgotPassword = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e password são obrigatórios' });
    }

    try {
        // Verificar se o email existe
        const userCheck = await pool.query(
            'SELECT id FROM users WHERE email = $1 LIMIT 1',
            [email]
        );

        if (userCheck.rowCount === 0) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Hash da nova senha
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Atualizar a senha do usuário e reativar a conta se ela estava desativada
        await pool.query(
            `UPDATE users
             SET password_hash = $1,
                 ativo = true,
                 deletado_em = NULL,
                 reactivation_token = NULL,
                 reactivation_token_expires_at = NULL
             WHERE email = $2`, [passwordHash, email]
        );

        return res.status(200).json({ message: 'Password updated successfully. Account reactivated.' });
    } catch (error) {
        console.error('Erro ao resetar senha:', error);
        return res.status(500).json({ message: 'Erro interno ao resetar senha' });
    }
};

// Controlador para solicitar reativação de conta. Ele verifica se o email fornecido existe no sistema,
// gera um token de reativação e uma data de expiração, e envia um email para o usuário com instruções 
// para reativar a conta. O controlador também lida com erros comuns, como campos ausentes, usuário 
// não encontrado e erros internos do servidor, retornando mensagens apropriadas para cada caso.
const requestReactivation = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email é obrigatório' });
    }

    try {
        const result = await pool.query(
            'SELECT id, username, email FROM users WHERE email = $1 LIMIT 1',
            [email]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const user = result.rows[0];
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + REACTIVATION_TOKEN_EXPIRY_MS);

        try {
            await pool.query(
                `UPDATE users
                 SET reactivation_token = $1,
                     reactivation_token_expires_at = $2
                 WHERE id = $3`,
                [token, expiresAt, user.id]
            );
        } catch (tokenError) {
            console.warn('Não foi possível salvar token de reativação (verifique migração 004):', tokenError.message);
        }

        let mailResult = { sent: false, reason: 'unknown_error' };
        try {
            mailResult = await sendReactivationEmail({ to: user.email, username: user.username });
        } catch (mailError) {
            console.error('Falha ao enviar email de reativação:', mailError);
            if (mailError?.code === 'EAUTH' || mailError?.responseCode === 535) {
                mailResult = { sent: false, reason: 'invalid_smtp_credentials' };
            } else {
                mailResult = { sent: false, reason: 'send_failure' };
            }
        }
        // Mapeamento de mensagens de resposta para diferentes razões de falha no envio de email, 
        // permitindo feedback claro ao usuário sobre o status da solicitação de reativação, mesmo 
        // quando o email não pode ser enviado devido a problemas de configuração ou credenciais SMTP.
        const responseMessageByReason = {
            missing_smtp_config: 'Solicitação registrada. SMTP não configurado no servidor.',
            invalid_smtp_credentials: 'Solicitação registrada. Credenciais SMTP inválidas (verifique App Password do Gmail).',
            send_failure: 'Solicitação registrada. Não foi possível enviar email agora; tente novamente mais tarde.',
            unknown_error: 'Solicitação registrada. Não foi possível enviar email agora; tente novamente mais tarde.',
        };


        return res.status(200).json({
            message: mailResult?.sent
                ? 'Email de reativação de conta enviado. Verifique sua caixa de spam também.'
                : responseMessageByReason[mailResult?.reason] || responseMessageByReason.unknown_error,
            mailSent: Boolean(mailResult?.sent),
            reason: mailResult?.reason || 'unknown_error',
        });
    } catch (error) {
        console.error('Erro ao solicitar reativação de conta:', error);
        return res.status(500).json({ message: 'Erro interno ao solicitar reativação de conta' });
    }
};


module.exports = {
    register,
    login,
    checkEmail,
    forgotPassword,
    requestReactivation,
};
