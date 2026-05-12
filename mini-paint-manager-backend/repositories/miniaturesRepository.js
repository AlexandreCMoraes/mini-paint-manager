const pool = require('../db');

// Busca todas as miniaturas de um usuário, ordenando por data de modificação ou criação 
// mais recente
const findAllByUserId = async (userId) => {
    const result = await pool.query(
        'SELECT * FROM miniaturas WHERE user_id = $1 ORDER BY COALESCE(data_modificacao, data_criacao) DESC, id DESC',
        [userId]
    );

    return result.rows;
};

// Busca miniaturas de um usuário com base em um termo de pesquisa e um campo específico, 
// ordenando por data de modificação ou criação mais recente
const searchByUserAndField = async ({ userId, search, field }) => {
    const query = field === 'altura'
        ? 'SELECT * FROM miniaturas WHERE user_id = $1 AND CAST(altura AS TEXT) LIKE $2 ORDER BY COALESCE(data_modificacao, data_criacao) DESC, id DESC'
        : `SELECT * FROM miniaturas WHERE user_id = $1 AND LOWER(${field}) LIKE LOWER($2) ORDER BY COALESCE(data_modificacao, data_criacao) DESC, id DESC`;

    const result = await pool.query(query, [userId, `%${search}%`]);
    return result.rows;
};

// Insere uma nova miniatura para um usuário, retornando a miniatura criada
const insertForUser = async ({ userId, payload }) => {
    const { nomeDoPersonagem, universo, escala, material, marca, alturaNumerica } = payload;

    const result = await pool.query(
        `INSERT INTO miniaturas (nome, universo, escala, material, marca, altura, user_id, data_criacao, data_modificacao)
     VALUES ($1,$2,$3,$4,$5,$6,$7, NOW(), NOW()) RETURNING *`,
        [nomeDoPersonagem, universo, escala, material, marca, alturaNumerica, userId]
    );

    return result.rows[0] || null;
};

// Deleta uma miniatura para um usuário, retornando a miniatura deletada ou null se não for encontrada
const deleteForUser = async ({ userId, id }) => {
    const result = await pool.query(
        'DELETE FROM miniaturas WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, userId]
    );

    return result.rows[0] || null;
};

// Atualiza uma miniatura para um usuário, retornando a miniatura atualizada ou null se não for encontrada ou
//  se o usuário não for o proprietário
const updateForUser = async ({ userId, id, payload }) => {
    const { nomeDoPersonagem, universo, escala, material, marca, alturaNumerica } = payload;

    const result = await pool.query(
        `UPDATE miniaturas
     SET nome = $1, universo = $2, escala = $3, material = $4, marca = $5, altura = $6, data_modificacao = NOW()
     WHERE id = $7 AND user_id = $8
     RETURNING *`,
        [nomeDoPersonagem, universo, escala, material, marca, alturaNumerica, id, userId]
    );

    return result.rows[0] || null;
};

module.exports = {
    findAllByUserId,
    searchByUserAndField,
    insertForUser,
    deleteForUser,
    updateForUser,
};
