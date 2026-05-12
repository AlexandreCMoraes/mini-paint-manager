const miniaturesRepository = require('../repositories/miniaturesRepository');

const listMiniaturesByUser = async (userId) => miniaturesRepository.findAllByUserId(userId);

// Busca miniaturas de um usuário com base em um termo de pesquisa e um campo específico, ordenando 
// por data de modificação ou criação mais recente
const searchMiniaturesByField = async ({ userId, search, field }) =>
    miniaturesRepository.searchByUserAndField({ userId, search, field });

// Insere uma nova miniatura para um usuário, retornando a miniatura criada
const createMiniatureForUser = async ({ userId, payload }) =>
    miniaturesRepository.insertForUser({ userId, payload });

// Deleta uma miniatura para um usuário, retornando a miniatura deletada ou null se não for encontrada
const deleteMiniatureForUser = async ({ userId, id }) =>
    miniaturesRepository.deleteForUser({ userId, id });

// Atualiza uma miniatura para um usuário, retornando a miniatura atualizada ou null se não for encontrada ou
//  se o usuário não for o proprietário
const updateMiniatureForUser = async ({ userId, id, payload }) =>
    miniaturesRepository.updateForUser({ userId, id, payload });

module.exports = {
    listMiniaturesByUser,
    searchMiniaturesByField,
    createMiniatureForUser,
    deleteMiniatureForUser,
    updateMiniatureForUser,
};
