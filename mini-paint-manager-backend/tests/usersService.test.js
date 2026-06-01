// TESTE DO SERVIÇO DE USUÁRIOS: Garante que os métodos do serviço de usuários 
// estejam delegando corretamente as chamadas para o repositório de usuários,
//  verificando se os argumentos passados para o repositório estão corretos e se os 
// resultados retornados pelo serviço são os esperados com base nas respostas do repositório.

const test = require('node:test'); // Módulo de teste nativo do Node.js para criar e executar testes unitários.
const assert = require('node:assert/strict'); // Módulo de asserção do Node.js para validar condições em 
// testes, garantindo que os resultados sejam os esperados.

const usersRepository = require('../repositories/usersRepository'); // Importa o módulo de repositório de 
// usuários, que é responsável por interagir com a camada de dados (banco de dados) para operações 
// relacionadas aos usuários. Este módulo é utilizado para verificar se os métodos do serviço de usuários 
// estão delegando corretamente as chamadas para o repositório.
const usersService = require('../services/usersService'); // Importa o módulo de serviço de usuários, 
// que contém a lógica de negócios relacionada aos usuários. Este serviço é o foco dos testes, onde 
// verificamos se ele está delegando corretamente as operações para o repositório de usuários. O serviço
//  pode incluir validações, regras de negócio e outras operações antes de chamar o repositório para 
// acessar os dados.

const originalRepository = { ...usersRepository }; // Cria uma cópia do repositório original para que
// possamos restaurá-lo após cada teste. Isso é importante para garantir que as alterações feitas nos 
// métodos do repositório durante os testes não afetem outros testes, mantendo a integridade e
//  independência de cada teste.

// Após cada teste, restauramos o repositório para seu estado original,
//  garantindo que as alterações feitas em um teste não afetem os outros testes. 
// Isso é crucial para manter a confiabilidade e a consistência dos testes, 
// permitindo que cada teste seja executado em um ambiente limpo e controlado.
test.afterEach(() => {
    Object.assign(usersRepository, originalRepository); // Restaura o repositório de usuários para 
    // seu estado original, garantindo que quaisquer alterações feitas nos métodos do repositório
    // durante os testes sejam revertidas. Isso é feito usando Object.assign para copiar as propriedades
    //  do repositório original de volta para o repositório atual, mantendo a integridade
    //  dos testes subsequentes.
});

// Testes para verificar se os métodos do serviço de usuários estão delegando
//  corretamente as chamadas para o repositório de usuários. Cada teste substitui
//  temporariamente um método do repositório por uma função personalizada que 
// verifica os parâmetros recebidos e retorna um resultado simulado, permitindo 
// validar se o serviço está chamando o repositório com os argumentos corretos e
//  retornando os resultados esperados.
test('getUserActiveStatus delega para repository', async () => {
    // Substitui temporariamente o método findActiveStatusById do repositório de 
    // usuários por uma função personalizada que verifica se o ID recebido é 5 e 
    // retorna um objeto simulando um usuário ativo. Isso permite testar se o 
    // serviço de usuários está chamando corretamente o repositório com o ID 
    // esperado e se está retornando o resultado correto.
    usersRepository.findActiveStatusById = async (id) => {
        assert.equal(id, 5); // Verifica se o ID recebido pelo método do repositório é 5, 
        // garantindo que o serviço esteja passando o argumento correto para o repositório.
        return { ativo: true }; // Retorna um objeto simulando um usuário ativo, permitindo 
        // que o teste verifique se o serviço de usuários está retornando o resultado esperado 
        // com base na resposta do repositório.
    };

    const result = await usersService.getUserActiveStatus(5); // Chama o método getUserActiveStatus do
    // serviço de usuários com o ID 5, que deve delegar a chamada para o método findActiveStatusById 
    // do repositório. O teste verifica se o serviço está passando o ID correto para o repositório e 
    // se está retornando o resultado esperado.
    assert.equal(result.ativo, true); // Verifica se o resultado retornado pelo serviço de usuários
    //  tem a propriedade ativo definida como true, confirmando que o serviço está processando 
    // corretamente a resposta do repositório e retornando o resultado esperado para um usuário ativo.
});

// Teste para verificar se o método softDeleteUser do serviço de usuários está 
// delegando corretamente a chamada para o método softDeleteById do repositório
//  de usuários. O teste substitui temporariamente o método do repositório por 
// uma função personalizada que verifica se o ID recebido é 8 e retorna um objeto 
// simulando um usuário desativado. Isso permite validar se o serviço de usuários
//  está chamando o repositório com o ID correto e se está retornando o resultado
//  esperado.
test('softDeleteUser delega para repository', async () => {
    // Substitui temporariamente o método softDeleteById do repositório de usuários por 
    // uma função personalizada que verifica se o ID recebido é 8 e retorna um 
    // objeto simulando um usuário desativado. Isso permite testar se o serviço 
    // de usuários está chamando corretamente o repositório com o ID esperado e 
    // se está retornando o resultado correto.
    usersRepository.softDeleteById = async (id) => {
        assert.equal(id, 8); // Verifica se o ID recebido pelo método do repositório é 8, 
        // garantindo que o serviço esteja passando o argumento correto para o repositório.
        return { id: 8, ativo: false }; // Retorna um objeto simulando um usuário desativado,
        //  permitindo que o teste verifique se o serviço de usuários está retornando o resultado 
        // esperado com base na resposta do repositório. 
    };

    const result = await usersService.softDeleteUser(8); // Chama o método softDeleteUser do 
    // serviço de usuários com o ID 8, que deve delegar a chamada para o método softDeleteById do 
    // repositório. O teste verifica se o serviço está passando o ID correto para o repositório e se
    //  está retornando o resultado esperado.
    assert.equal(result.id, 8); // Verifica se o resultado retornado pelo serviço de usuários tem 
    // a propriedade id igual a 8, confirmando que o serviço está processando corretamente a resposta
    //  do repositório e retornando o resultado esperado para um usuário desativado.
});
