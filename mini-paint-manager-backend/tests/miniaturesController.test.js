// TESTE DO CONTROLLER: Simula o Express (req/res) para verificar se a API entrega os 
// status corretos (201, 400, 404) baseado no retorno do Service.

const test = require('node:test');
const assert = require('node:assert/strict');

const controller = require('../controllers/miniaturesController');
const miniaturesService = require('../services/miniaturesService');
const miniatureValidator = require('../validators/miniatureValidator');

const originalService = { ...miniaturesService };
const originalValidate = miniatureValidator.validateMiniaturePayload;

// A suíte de testes para o controlador de miniaturas verifica o comportamento das funções responsáveis 
// por criar, listar, buscar e deletar miniaturas. Os testes cobrem cenários como falha na validação de
//  payload, criação bem-sucedida, tentativa de exclusão de item inexistente e normalização de campos de
// busca. O uso de mocks para as funções do serviço e do validador permite isolar o comportamento do 
// controlador e garantir que ele responda corretamente a diferentes situações, retornando os códigos de
//  status e mensagens apropriados.
function createRes() {
    return {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.body = payload;
            return this;
        },
    };
}

// Os testes abaixo verificam o comportamento do controlador de miniaturas em diferentes cenários, como 
// falha na validação de payload, criação bem-sucedida, tentativa de exclusão de item inexistente e 
// normalização de campos de busca. O uso de mocks para as funções do serviço e do validador permite 
// isolar o comportamento do controlador e garantir que ele responda corretamente a diferentes situações, 
// retornando os códigos de status e mensagens apropriados.
test.afterEach(() => {
    Object.assign(miniaturesService, originalService); // Restaura as funções originais do serviço
    miniatureValidator.validateMiniaturePayload = originalValidate; // Restaura a função original de validação
});

// Os testes abaixo verificam o comportamento do controlador de miniaturas em diferentes cenários, como 
// falha na validação de payload, criação bem-sucedida, tentativa de exclusão de item inexistente e 
// normalização de campos de busca. O uso de mocks para as funções do serviço e do validador permite 
// isolar o comportamento do controlador e garantir que ele responda corretamente a diferentes situações, 
// retornando os códigos de status e mensagens apropriados.
test('createMiniature deve retornar 400 quando validação falha', async () => {
    // Mock da função de validação para simular falha
    miniatureValidator.validateMiniaturePayload = () => ({ ok: false, status: 400, message: 'payload inválido' });

    const req = { user: { id: 1 }, body: {} }; // Payload vazio para simular falha de validação
    const res = createRes(); // Mock do objeto de resposta

    await controller.createMiniature(req, res); // Chama a função do controlador

    assert.equal(res.statusCode, 400); // Verifica se o status retornado é 400
    assert.deepEqual(res.body, { message: 'payload inválido' }); // Verifica se a mensagem de erro é a esperada
});

// Os testes abaixo verificam o comportamento do controlador de miniaturas em diferentes cenários, como 
// falha na validação de payload, criação bem-sucedida, tentativa de exclusão de item inexistente e 
// normalização de campos de busca. O uso de mocks para as funções do serviço e do validador permite 
// isolar o comportamento do controlador e garantir que ele responda corretamente a diferentes situações, 
// retornando os códigos de status e mensagens apropriados.
test('createMiniature deve retornar 201 quando serviço cria item', async () => {
    // Mock da função de validação para simular sucesso
    miniatureValidator.validateMiniaturePayload = () => ({ ok: true, value: { nomeDoPersonagem: 'Ryu' } });
    miniaturesService.createMiniatureForUser = async () => ({ id: 11, nome: 'Ryu' }); // Mock do serviço para simular criação bem-sucedida

    const req = { user: { id: 2 }, body: { nomeDoPersonagem: 'Ryu' } }; // Payload válido para simular criação bem-sucedida
    const res = createRes(); // Mock do objeto de resposta

    await controller.createMiniature(req, res); // Chama a função do controlador

    assert.equal(res.statusCode, 201); // Verifica se o status retornado é 201 (Criado)
    assert.deepEqual(res.body, { id: 11, nome: 'Ryu' }); // Verifica se o corpo da resposta contém os dados da miniatura criada
});

// Os testes abaixo verificam o comportamento do controlador de miniaturas em diferentes cenários, como 
// falha na validação de payload, criação bem-sucedida, tentativa de exclusão de item inexistente e 
// normalização de campos de busca. O uso de mocks para as funções do serviço e do validador permite 
// isolar o comportamento do controlador e garantir que ele responda corretamente a diferentes situações, 
// retornando os códigos de status e mensagens apropriados.
test('deleteMiniature deve retornar 404 quando item não existe', async () => {
    miniaturesService.deleteMiniatureForUser = async () => null; // Mock do serviço para simular item não encontrado

    const req = { user: { id: 3 }, params: { id: 999 } }; // Requisição simulando tentativa de exclusão de item inexistente
    const res = createRes(); // Mock do objeto de resposta

    await controller.deleteMiniature(req, res); // Chama a função do controlador

    assert.equal(res.statusCode, 404); // Verifica se o status retornado é 404 (Não Encontrado)
    assert.deepEqual(res.body, { message: 'Miniatura não encontrada' }); // Verifica se a mensagem de erro é a esperada
});

// Os testes abaixo verificam o comportamento do controlador de miniaturas em diferentes cenários, como 
// falha na validação de payload, criação bem-sucedida, tentativa de exclusão de item inexistente e 
// normalização de campos de busca. O uso de mocks para as funções do serviço e do validador permite 
// isolar o comportamento do controlador e garantir que ele responda corretamente a diferentes situações, 
// retornando os códigos de status e mensagens apropriados.
test('searchMiniatures deve normalizar campo inválido para nome', async () => {
    let capturedField = null; // Variável para capturar o campo passado para a função de busca
    // Mock do serviço para capturar o campo de busca e simular retorno vazio
    miniaturesService.searchMiniaturesByField = async ({ field }) => {
        capturedField = field;
        return [];
    };

    const req = { user: { id: 7 }, query: { search: 'bat', field: 'campo_invalido' } }; // Requisição simulando busca com campo inválido
    const res = createRes();

    await controller.searchMiniatures(req, res); // Chama a função do controlador

    assert.equal(capturedField, 'nome'); // Verifica se o campo foi normalizado para 'nome'
    assert.deepEqual(res.body, []); // Verifica se o corpo da resposta é um array vazio, como simulado no
    //  mock do serviço
});
