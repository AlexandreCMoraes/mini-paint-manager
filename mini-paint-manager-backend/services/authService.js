const authRepository = require('../repositories/authRepository');

// Veriifica se o nome de usuário ou email já existe no banco de dados
const getDuplicateStatus = async ({ username, email }) => {
    const rows = await authRepository.findDuplicatesByUsernameOrEmail({ username, email });
    return {
        hasUsername: rows.some((row) => row.username === username),
        hasEmail: rows.some((row) => row.email === email),
    };
};

// Registra um novo usuário no banco de dados
const registerUser = async ({ username, email, passwordHash }) =>
    authRepository.createUser({ username, email, passwordHash });

// Encontra um usuário para login usando o nome de usuário
const findLoginUser = async (username) => authRepository.findUserForLoginByUsername(username);

// Encontra um usuário para reativação usando o email
const findEmailUser = async (email) => authRepository.findUserIdByEmail(email);

// Atualiza a senha e reativa a conta do usuário
const updatePasswordAndReactivate = async ({ email, passwordHash }) =>
    authRepository.reactivateUserAndUpdatePassword({ email, passwordHash });

// Encontra um usuário para reativação usando o email
const findReactivationUser = async (email) => authRepository.findUserForReactivationByEmail(email);

// Salva o token de reativação para um usuário
const setReactivationToken = async ({ userId, token, expiresAt }) =>
    authRepository.saveReactivationToken({ userId, token, expiresAt });

module.exports = {
    getDuplicateStatus,
    registerUser,
    findLoginUser,
    findEmailUser,
    updatePasswordAndReactivate,
    findReactivationUser,
    setReactivationToken,
};
