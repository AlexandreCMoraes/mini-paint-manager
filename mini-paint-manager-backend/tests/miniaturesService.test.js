const test = require('node:test');
const assert = require('node:assert/strict');

const pool = require('../db'); // Importa o pool de conexões para mockar as consultas ao banco
const service = require('../services/miniaturesService');

const originalQuery = pool.query; // Guarda a função original para restaurar depois dos testes

// Limpa o mock após cada teste para evitar interferência entre testes 
test.afterEach(() => {
    pool.query = originalQuery; // Restaura a função original do pool.query após cada teste
});

// Testes para a função listMiniaturesByUser do arquivo miniaturesService.js
test('listMiniaturesByUser retorna rows do banco', async () => {
    // Mock da função pool.query para simular retorno do banco de dados
    pool.query = async (sql, params) => {
        assert.match(sql, /SELECT \*/); // Verifica se a consulta SQL é um SELECT
        assert.deepEqual(params, [7]); // Verifica se o parâmetro userId é passado corretamente
        return { rows: [{ id: 1 }, { id: 2 }] }; // Simula retorno de duas miniaturas para o usuário
    };

    const rows = await service.listMiniaturesByUser(7); // Chama a função com userId 7
    assert.equal(rows.length, 2); // Verifica se o número de miniaturas retornadas é 2
});

// Testes para a função searchMiniaturesByField do arquivo miniaturesService.js
test('searchMiniaturesByField usa CAST para altura', async () => {
    // Mock da função pool.query para simular retorno do banco de dados
    pool.query = async (sql, params) => {
        assert.match(sql, /CAST\(altura AS TEXT\)/); // Verifica se a consulta SQL usa CAST para altura
        assert.deepEqual(params, [5, '%12%']); // Verifica se os parâmetros são passados corretamente
        return { rows: [{ id: 10 }] }; // Simula retorno de uma miniatura encontrada
    };

    // Chama a função com userId 5, search '12' e field 'altura'
    const rows = await service.searchMiniaturesByField({ userId: 5, search: '12', field: 'altura' });
    assert.equal(rows[0].id, 10); // Verifica se a miniatura retornada tem o id esperado
});

// Testes para a função createMiniatureForUser do arquivo miniaturesService.js
test('createMiniatureForUser retorna primeira row inserida', async () => {
    // Mock da função pool.query para simular inserção no banco de dados
    pool.query = async (_sql, params) => {
        assert.equal(params[0], 'Link'); // Verifica se o nomeDoPersonagem é passado corretamente
        assert.equal(params[6], 3); // Verifica se o userId é passado corretamente
        return { rows: [{ id: 99, nome: 'Link' }] }; // Simula retorno da miniatura criada com id 99
    };

    // Chama a função com userId 3 e payload de miniatura
    const created = await service.createMiniatureForUser({
        userId: 3,
        payload: {
            nomeDoPersonagem: 'Link',
            universo: 'Zelda',
            escala: '1:12',
            material: 'Resina',
            marca: 'Elegoo',
            alturaNumerica: 17,
        },
    });

    assert.equal(created.id, 99); // Verifica se a miniatura criada tem o id esperado
});

// Testes para a função deleteMiniatureForUser do arquivo miniaturesService.js
test('deleteMiniatureForUser retorna null quando não encontra item', async () => {
    pool.query = async () => ({ rows: [] }); // Simula retorno de nenhuma linha encontrada para exclusão

    // Chama a função com userId 2 e id de miniatura 1234
    const deleted = await service.deleteMiniatureForUser({ userId: 2, id: 1234 });
    assert.equal(deleted, null); // Verifica se o resultado é null quando a miniatura não é encontrada para exclusão
});

// Testes para a função deleteMiniatureForUser do arquivo miniaturesService.js
test('updateMiniatureForUser retorna row atualizada', async () => {
    // Mock da função pool.query para simular atualização no banco de dados
    pool.query = async (_sql, params) => {
        assert.equal(params[6], 42); // Verifica se o id da miniatura é passado corretamente
        assert.equal(params[7], 1); // Verifica se o userId é passado corretamente
        return { rows: [{ id: 42, nome: 'Cloud' }] }; // Simula retorno da miniatura atualizada
    };

    // Chama a função com userId 1, id de miniatura 42 e payload de atualização
    const updated = await service.updateMiniatureForUser({
        userId: 1,
        id: 42,
        payload: {
            nomeDoPersonagem: 'Cloud',
            universo: 'FF7',
            escala: '1:10',
            material: 'PVC',
            marca: 'Bandai',
            alturaNumerica: 19,
        },
    });

    assert.equal(updated.nome, 'Cloud'); // Verifica se a miniatura atualizada tem o nome esperado
});
