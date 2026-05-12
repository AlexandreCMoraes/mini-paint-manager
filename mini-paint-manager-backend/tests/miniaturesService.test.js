const test = require('node:test');
const assert = require('node:assert/strict');

const miniaturesRepository = require('../repositories/miniaturesRepository'); // Importa o repositório para poder restaurar a função original do pool.query após os testes
const service = require('../services/miniaturesService');

const originalRepository = { ...miniaturesRepository }; // Faz uma cópia do repositório original para poder restaurar as funções após os testes

// Limpa o mock após cada teste para evitar interferência entre testes 
test.afterEach(() => {
    Object.assign(miniaturesRepository, originalRepository); // Restaura as funções originais do repositório
});

// Testes para a função listMiniaturesByUser do arquivo miniaturesService.js
test('listMiniaturesByUser delega para repository', async () => {
    // Mock da função findAllByUserId para simular retorno do banco de dados
    miniaturesRepository.findAllByUserId = async (userId) => {
        assert.equal(userId, 7); // Verifica se a função é chamada com o userId correto
        return [{ id: 1 }, { id: 2 }]; // Simula retorno de 2 miniaturas para o usuário com id 7
    };

    const rows = await service.listMiniaturesByUser(7); // Chama a função com userId 7
    assert.equal(rows.length, 2); // Verifica se o número de miniaturas retornadas é 2
});

// Testes para a função searchMiniaturesByField do arquivo miniaturesService.js
test('searchMiniaturesByField delega busca com parâmetros corretos', async () => {
    // Mock da função searchByUserAndField para simular retorno do banco de dados
    miniaturesRepository.searchByUserAndField = async (input) => {
        assert.deepEqual(input, { userId: 5, search: '12', field: 'altura' }); // Verifica se a função é chamada com os parâmetros corretos
        return [{ id: 10 }]; // Simula retorno de 1 miniatura que corresponde à busca para o usuário com id 5, buscando por '12' no campo 'altura'
    };

    // Chama a função com userId 5, search '12' e field 'altura'
    const rows = await service.searchMiniaturesByField({ userId: 5, search: '12', field: 'altura' });
    assert.equal(rows[0].id, 10); // Verifica se a miniatura retornada tem o id esperado
});

// 
test('createMiniatureForUser retorna item criado do repository', async () => {
    // Mock da função insertForUser para simular inserção no banco de dados
    miniaturesRepository.insertForUser = async ({ userId, payload }) => {
        assert.equal(userId, 3); // Verifica se a função é chamada com o userId correto
        assert.equal(payload.nomeDoPersonagem, 'Link'); // Verifica se o payload contém o nome do personagem correto
        return { id: 99, nome: 'Link' }; // Simula retorno da miniatura criada com id 99 e nome 'Link'
    };

    // Chama a função com userId 3 e payload de miniatura
    const created = await service.createMiniatureForUser({
        userId: 3,
        payload: { nomeDoPersonagem: 'Link' },
    });

    assert.equal(created.id, 99); // Verifica se a miniatura criada tem o id esperado
});

// Testes para a função deleteMiniatureForUser do arquivo miniaturesService.js
test('deleteMiniatureForUser retorna null quando repository não encontra', async () => {
    miniaturesRepository.deleteForUser = async () => null; // Mock da função deleteForUser para simular cenário onde a miniatura não é encontrada para exclusão

    // Chama a função com userId 2 e id de miniatura 1234
    const deleted = await service.deleteMiniatureForUser({ userId: 2, id: 1234 });
    assert.equal(deleted, null); // Verifica se o resultado é null quando a miniatura não é encontrada para exclusão
});

// Testes para a função deleteMiniatureForUser do arquivo miniaturesService.js
test('updateMiniatureForUser retorna row atualizada do repository', async () => {
    // Mock da função pool.query para simular atualização no banco de dados
    miniaturesRepository.updateForUser = async ({ userId, id }) => {
        assert.equal(userId, 1); // Verifica se a função é chamada com o userId correto
        assert.equal(id, 42); // Verifica se a função é chamada com o id correto
        return { id: 42, nome: 'Cloud' }
    }; // Simula retorno da miniatura atualizada com id 42 e nome 'Cloud'


    // Chama a função com userId 1, id de miniatura 42 e payload de atualização
    const updated = await service.updateMiniatureForUser({
        userId: 1,
        id: 42,
        payload: { nomeDoPersonagem: 'Cloud' },
    });

    assert.equal(updated.nome, 'Cloud'); // Verifica se a miniatura atualizada tem o nome esperado
});
