// TESTE DE INTEGRAÇÃO: Sobe o app real em uma porta aleatória (0) para testar se a 
// infraestrutura do Express e a rota /health respondem de verdade via rede.

const test = require('node:test');
const assert = require('node:assert/strict');

const app = require('../app');

// Teste para verificar se a rota /health está funcionando corretamente e retornando o status esperado
test('GET /health deve retornar status ok', async () => {
    const server = app.listen(0); // Inicia o servidor em uma porta aleatória/livre. 

    try {
        const { port } = server.address(); // Obtém a porta em que o servidor está rodando
        const response = await fetch(`http://127.0.0.1:${port}/health`); // Faz uma requisição para a rota de saúde
        const data = await response.json();  // Converte a resposta para JSON

        assert.equal(response.status, 200); // Verifica se o status da resposta é 200
        assert.equal(data.status, 'ok'); // Verifica se o status retornado é 'ok'
        assert.equal(data.service, 'mini-paint-manager-api');// Verifica se o nome do serviço retornado é 'mini-paint-manager-api'
    } finally {
        await new Promise((resolve) => server.close(resolve)); // Fecha o servidor após o teste ser concluído
    }
});
