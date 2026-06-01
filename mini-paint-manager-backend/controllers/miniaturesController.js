// PORTEIRO (HTTP): Recebe as requisições web, chama o validador, delega o trabalho
//  para o Service e devolve as respostas HTTP (200, 201, 404).

const miniatureValidator = require('../validators/miniatureValidator');
const miniaturesService = require('../services/miniaturesService');
const allowedFields = ['nome', 'universo', 'escala', 'material', 'marca', 'altura'];

// O controlador de miniaturas é responsável por lidar com as requisições relacionadas às miniaturas do usuário,
//  incluindo listagem, busca, criação, atualização e exclusão. Ele utiliza as funções do serviço de miniaturas
//  para realizar as operações no banco de dados, garantindo que as ações sejam executadas apenas nas miniaturas
//  pertencentes ao usuário autenticado. O controlador também lida com a validação de entrada e o tratamento de erros,
//  retornando respostas apropriadas para cada cenário, como sucesso, campos ausentes, miniaturas não encontradas ou erros internos do servidor.
const listMiniatures = async (req, res) => {
    try {
        const rows = await miniaturesService.listMiniaturesByUser(req.user.id); // Chama o serviço para listar as miniaturas do usuário autenticado
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao listar miniaturas' });
    }
};

const searchMiniatures = async (req, res) => {
    const { search, field = 'nome' } = req.query;
    const normalizedField = allowedFields.includes(field) ? field : 'nome';
    try {
        if (!search || search.trim() === '') {
            return res.json([]);
        }
        // Chama o serviço para buscar miniaturas do usuário autenticado com base no termo de busca e 
        // campo especificado
        const rows = await miniaturesService.searchMiniaturesByField({
            userId: req.user.id,
            search,
            field: normalizedField,
        });

        return res.json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar miniaturas' });
    }
};

const createMiniature = async (req, res) => {
    const validation = miniatureValidator.validateMiniaturePayload(req.body); // Valida o payload da requisição usando o validador de miniaturas

    if (!validation.ok) {
        return res.status(validation.status).json({ message: validation.message });
    }

    try {
        const created = await miniaturesService.createMiniatureForUser({
            userId: req.user.id,
            payload: validation.value,
        });

        return res.status(201).json(created);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao adicionar miniatura' });
    }
};

const deleteMiniature = async (req, res) => {
    const { id } = req.params;

    try {
        // Chama o serviço para deletar a miniatura do usuário autenticado com base no ID fornecido na URL
        const deleted = await miniaturesService.deleteMiniatureForUser({ userId: req.user.id, id });

        if (!deleted) {
            return res.status(404).json({ message: 'Miniatura não encontrada' });
        }


        return res.json({ message: 'Miniatura deletada com sucesso', deleted });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao deletar a miniatura' });
    }
};

// Controlador de atualização de miniaturas que permite ao usuário modificar os detalhes de uma
//  miniatura existente.
const updateMiniature = async (req, res) => {
    const { id } = req.params;
    const validation = miniatureValidator.validateMiniaturePayload(req.body); // Valida o payload da requisição usando o validador de miniaturas

    if (!validation.ok) {
        return res.status(validation.status).json({ message: validation.message });
    }

    try {
        const updated = await miniaturesService.updateMiniatureForUser({
            userId: req.user.id,
            id,
            payload: validation.value,
        });

        if (!updated) {
            return res.status(404).json({ message: 'Miniatura não encontrada' });
        }


        return res.json({
            message: 'Miniatura atualizada com sucesso',
            updated,
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
