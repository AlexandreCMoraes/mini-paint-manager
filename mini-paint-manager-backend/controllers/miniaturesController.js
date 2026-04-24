const pool = require('../db');

const allowedFields = ['nome', 'universo', 'escala', 'material', 'marca', 'altura'];

// Controlador de miniaturas que lida com as operações CRUD para as miniaturas do usuário. 
// Ele inclui funções para listar, buscar, criar, atualizar e deletar miniaturas, 
// garantindo que as operações sejam realizadas apenas nas miniaturas pertencentes ao 
// usuário autenticado. O controlador também inclui validação de entrada para garantir 
// que os dados fornecidos sejam completos e estejam no formato correto, retornando 
// mensagens de erro apropriadas para diferentes cenários, como campos ausentes, miniaturas 
// não encontradas ou erros internos do servidor.
const listMiniatures = async (req, res) => {
    try {
        const result = await pool.query(
            // A consulta SQL foi ajustada para ordenar as miniaturas primeiro pela data de modificação 
            // (data_modificacao) e, se não houver data de modificação, pela data de criação (data_criacao). 
            // Isso garante que as miniaturas mais recentemente modificadas ou criadas apareçam primeiro na lista.
            'SELECT * FROM miniaturas WHERE user_id = $1 ORDER BY COALESCE(data_modificacao, data_criacao) DESC, id DESC',
            [req.user.id]
        );

        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao listar miniaturas' });
    }
};

// Controlador de busca que permite ao usuário pesquisar suas miniaturas com base em um 
// termo de pesquisa e um campo específico. Ele valida o campo de pesquisa para garantir 
// que seja um dos campos permitidos, e se o termo de pesquisa estiver vazio, retorna uma 
// lista vazia. O controlador constrói dinamicamente a consulta SQL com base no campo 
// selecionado, utilizando LIKE para correspondência parcial, e retorna os resultados 
// ordenados por ID. Em caso de erros durante a consulta, ele captura e registra o erro, 
// retornando uma mensagem de erro apropriada.
const searchMiniatures = async (req, res) => {
    const { search, field = 'nome' } = req.query;
    const normalizedField = allowedFields.includes(field) ? field : 'nome';

    try {
        if (!search || search.trim() === '') {
            return res.json([]);
        }

        const query = normalizedField === 'altura'
            ? 'SELECT * FROM miniaturas WHERE user_id = $1 AND CAST(altura AS TEXT) LIKE $2 ORDER BY COALESCE(data_modificacao, data_criacao) DESC, id DESC'
            : `SELECT * FROM miniaturas WHERE user_id = $1 AND LOWER(${normalizedField}) LIKE LOWER($2) ORDER BY COALESCE(data_modificacao, data_criacao) DESC, id DESC`;
        const params = [req.user.id, `%${search}%`];
        const result = await pool.query(query, params);

        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar miniaturas' });
    }
};

// Controlador de criação de miniaturas que permite ao usuário adicionar uma nova miniatura 
// à sua coleção. Ele valida os dados de entrada para garantir que todos os campos 
// obrigatórios estejam presentes e que a altura seja um número positivo. O controlador 
// também verifica se a escala está no formato correto (por exemplo, "1:12") ou se é 
// "N/A". Se a validação for bem-sucedida, ele insere a nova miniatura no banco de dados 
// associada ao usuário autenticado e retorna os detalhes da miniatura criada. 
// Em caso de erros durante a inserção, ele captura e registra o erro, retornando uma 
// mensagem de erro apropriada.
const createMiniature = async (req, res) => {
    const { nomeDoPersonagem, universo, escala, material, marca, altura } = req.body;
    const alturaNumerica = Number(altura);

    if (!nomeDoPersonagem || !universo || !escala || !material || !marca || Number.isNaN(alturaNumerica)) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    if (alturaNumerica <= 0) {
        return res.status(400).json({ message: 'A altura deve ser maior que zero' });
    }

    const escalaPattern = /^\d+:\d+$/;
    if (!(escalaPattern.test(escala) || escala.trim().toUpperCase() === 'N/A')) {
        return res.status(400).json({ message: 'A escala deve estar no formato 1:12, 1:24, etc., ou N/A.' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO miniaturas (nome, universo, escala, material, marca, altura, user_id, data_criacao, data_modificacao)
       VALUES ($1,$2,$3,$4,$5,$6,$7, NOW()) RETURNING *`,
            [nomeDoPersonagem, universo, escala, material, marca, alturaNumerica, req.user.id]
        );

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao adicionar miniatura' });
    }
};

const deleteMiniature = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM miniaturas WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Miniatura não encontrada' });
        }

        return res.json({ message: 'Miniatura deletada com sucesso', deleted: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao deletar a miniatura' });
    }
};

const updateMiniature = async (req, res) => {
    const { id } = req.params;
    const { nomeDoPersonagem, universo, escala, material, marca, altura } = req.body;
    const alturaNumerica = Number(altura);

    if (!nomeDoPersonagem || !universo || !escala || !material || !marca || Number.isNaN(alturaNumerica)) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    if (alturaNumerica <= 0) {
        return res.status(400).json({ message: 'A altura deve ser maior que zero' });
    }

    const escalaPattern = /^\d+:\d+$/;
    if (!(escalaPattern.test(escala) || escala.trim().toUpperCase() === 'N/A')) {
        return res.status(400).json({ message: 'A escala deve estar no formato 1:12, 1:24, etc., ou N/A.' });
    }

    try {
        const result = await pool.query(
            // A consulta SQL foi ajustada para atualizar a data de modificação (data_modificacao) para a
            //  data e hora atuais (NOW()) sempre que uma miniatura for atualizada.
            `UPDATE miniaturas
       SET nome = $1, universo = $2, escala = $3, material = $4, marca = $5, altura = $6, data_modificacao = NOW()
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
            [nomeDoPersonagem, universo, escala, material, marca, alturaNumerica, id, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Miniatura não encontrada' });
        }

        return res.json({
            message: 'Miniatura atualizada com sucesso',
            updated: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao atualizar miniatura' });
    }
};

module.exports = {
    listMiniatures,
    searchMiniatures,
    createMiniature,
    deleteMiniature,
    updateMiniature,
};
