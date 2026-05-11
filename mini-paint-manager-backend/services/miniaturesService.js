const pool = require('../db');
// O serviço de miniaturas é responsável por lidar com a lógica de negócios relacionada às miniaturas do usuário.
//  Ele inclui funções para listar, buscar, criar, atualizar e deletar miniaturas, garantindo que as operações
//  sejam realizadas apenas nas miniaturas pertencentes ao usuário autenticado. O serviço também inclui 
// validação de entrada para garantir que os dados fornecidos sejam completos e estejam no formato correto,
//  retornando mensagens de erro apropriadas para diferentes cenários, como campos ausentes, miniaturas não 
// encontradas ou erros internos do servidor.
const listMiniaturesByUser = async (userId) => {
    const result = await pool.query(
        'SELECT * FROM miniaturas WHERE user_id = $1 ORDER BY COALESCE(data_modificacao, data_criacao) DESC, id DESC',
        [userId]
    );

    return result.rows;
};

// A função searchMiniaturesByField é responsável por buscar miniaturas com base em um campo 
// específico e um termo de pesquisa fornecido pelo usuário. Ela constrói uma consulta SQL dinâmica 
// para realizar a busca, garantindo que a busca seja feita apenas nas miniaturas pertencentes ao 
// usuário autenticado. A função também lida com a formatação da consulta para campos numéricos, como 
// "altura", e retorna os resultados ordenados por data de modificação ou criação.
const searchMiniaturesByField = async ({ userId, search, field }) => {
    const query = field === 'altura'
        ? 'SELECT * FROM miniaturas WHERE user_id = $1 AND CAST(altura AS TEXT) LIKE $2 ORDER BY COALESCE(data_modificacao, data_criacao) DESC, id DESC'
        : `SELECT * FROM miniaturas WHERE user_id = $1 AND LOWER(${field}) LIKE LOWER($2) ORDER BY COALESCE(data_modificacao, data_criacao) DESC, id DESC`;

    const result = await pool.query(query, [userId, `%${search}%`]);
    return result.rows;
};

// A função createMiniatureForUser é responsável por criar uma nova miniatura para um usuário específico.
//  Ela recebe o ID do usuário e os dados da miniatura a ser criada, insere as informações no banco de dados
// e retorna a miniatura criada. A função também garante que a miniatura seja associada ao usuário correto,
//  utilizando o user_id na tabela de miniaturas.
const createMiniatureForUser = async ({ userId, payload }) => {
    const { nomeDoPersonagem, universo, escala, material, marca, alturaNumerica } = payload;

    const result = await pool.query(
        `INSERT INTO miniaturas (nome, universo, escala, material, marca, altura, user_id, data_criacao, data_modificacao)
     VALUES ($1,$2,$3,$4,$5,$6,$7, NOW(), NOW()) RETURNING *`,
        [nomeDoPersonagem, universo, escala, material, marca, alturaNumerica, userId]
    );

    return result.rows[0];
};

const deleteMiniatureForUser = async ({ userId, id }) => {
    const result = await pool.query(
        'DELETE FROM miniaturas WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, userId]
    );

    return result.rows[0] || null;
};

const updateMiniatureForUser = async ({ userId, id, payload }) => {
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
    listMiniaturesByUser,
    searchMiniaturesByField,
    createMiniatureForUser,
    deleteMiniatureForUser,
    updateMiniatureForUser,
};
