const pool = require('../db');

// Função para verificar o status ativo de um usuário pelo ID. Retorna um objeto 
// com a coluna 'ativo' ou null se o usuário não for encontrado.
const findActiveStatusById = async (id) => {
    const result = await pool.query('SELECT ativo FROM users WHERE id = $1 LIMIT 1', [id]);
    return result.rows[0] || null;
};

// Função para realizar a exclusão lógica (soft delete) de um usuário pelo ID. 
// Ela atualiza o campo 'ativo' para false e define a data de exclusão em 
// 'deletado_em'. Retorna um objeto com os campos id, username, email, ativo e 
// deletado_em do usuário atualizado, ou null se o usuário não for encontrado 
// ou já estiver inativo.
const softDeleteById = async (id) => {
    const result = await pool.query(
        `UPDATE users
     SET ativo = false,
         deletado_em = NOW()
     WHERE id = $1 AND ativo = true
     RETURNING id, username, email, ativo, deletado_em`,
        [id]
    );

    return result.rows[0] || null;
};

module.exports = {
    findActiveStatusById,
    softDeleteById,
};
