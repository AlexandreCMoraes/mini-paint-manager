const test = require('node:test');
const assert = require('node:assert/strict');
const { validateMiniaturePayload } = require('../validators/miniatureValidator');

// Testes para a função validateMiniaturePayload do arquivo miniatureValidator.js
test('deve validar payload correto e retornar alturaNumerica', () => {
    const result = validateMiniaturePayload({
        nomeDoPersonagem: 'Master Chief',
        universo: 'Halo',
        escala: '1:12',
        material: 'Resina',
        marca: 'Elegoo',
        altura: '18.5',
    });

    assert.equal(result.ok, true);
    assert.equal(result.value.alturaNumerica, 18.5);
});

// Testes para casos de erro de validação do payload de miniatura - campos obrigatórios ausentes
test('deve rejeitar payload com campos obrigatórios ausentes', () => {
    const result = validateMiniaturePayload({
        nomeDoPersonagem: 'Batman',
        universo: '',
        escala: '1:10',
        material: 'Resina',
        marca: 'Anycubic',
        altura: 12,
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
    assert.equal(result.message, 'Todos os campos são obrigatórios');
});

// Testes para casos de erro de validação do payload de miniatura - altura inválida 
test('deve rejeitar altura inválida (<= 0)', () => {
    const result = validateMiniaturePayload({
        nomeDoPersonagem: 'Goku',
        universo: 'Dragon Ball',
        escala: '1:8',
        material: 'PVC',
        marca: 'Bandai',
        altura: 0,
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
    assert.equal(result.message, 'A altura deve ser maior que zero');
});

// Testes para casos de erro de validação do payload de miniatura - escala inválida 
test('deve aceitar escala N/A', () => {
    const result = validateMiniaturePayload({
        nomeDoPersonagem: 'Diorama',
        universo: 'Original',
        escala: 'N/A',
        material: 'Resina',
        marca: 'Elegoo',
        altura: 25,
    });

    assert.equal(result.ok, true);
});

// Testes para casos de erro de validação do payload de miniatura - escala em formato inválido 
test('deve rejeitar escala em formato inválido', () => {
    const result = validateMiniaturePayload({
        nomeDoPersonagem: 'Kratos',
        universo: 'God of War',
        escala: '1-12',
        material: 'Resina',
        marca: 'Anycubic',
        altura: 20,
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
    assert.equal(result.message, 'A escala deve estar no formato 1:12, 1:24, etc., ou N/A.');
});
