// TESTE DO authService: Focado na lógica de negócio, sem depender do 
// banco de dados real ou da implementação do repositório.

const test = require('node:test');
const assert = require('node:assert/strict');

const authRepository = require('../repositories/authRepository');
const authService = require('../services/authService');

const originalRepository = { ...authRepository };

test.afterEach(() => {
    Object.assign(authRepository, originalRepository);
});

// Testa a lógica de detecção de duplicados, simulando o retorno do repositório.
test('getDuplicateStatus identifica username/email duplicados', async () => {
    authRepository.findDuplicatesByUsernameOrEmail = async () => [
        { username: 'ana', email: 'ana@mail.com' },
        { username: 'bob', email: 'bob@mail.com' },
    ];

    const result = await authService.getDuplicateStatus({ username: 'ana', email: 'x@mail.com' });
    assert.equal(result.hasUsername, true);
    assert.equal(result.hasEmail, false);
});

// Testa a delegação correta para o repositório ao buscar um usuário para login.
test('findLoginUser delega para repository', async () => {
    authRepository.findUserForLoginByUsername = async (username) => ({ username });
    const user = await authService.findLoginUser('maria');
    assert.equal(user.username, 'maria');
});
