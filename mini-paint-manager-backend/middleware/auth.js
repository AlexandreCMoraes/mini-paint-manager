// FILTRO DE AUTENTICAÇÃO: Valida o token JWT em requisições protegidas, checa se o 
// usuário está ativo no banco e injeta os dados em 'req.user'.

const jwt = require('jsonwebtoken');
const usersService = require('../services/usersService');

// Middleware de autenticação para rotas protegidas
const authMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization;
    // Verifica se o header de autorização existe e tem o formato correto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não informado' });
    }

    const token = authHeader.split(' ')[1]; // Extrai o token do header

    // Verifica e decodifica o token JWT, e checa se o usuário associado está ativo
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenUser = await usersService.getUserActiveStatus(decoded.id);

        if (!tokenUser) {
            return res.status(401).json({ message: 'Usuário do token não encontrado' });
        }

        if (!tokenUser.ativo) {
            return res.status(403).json({
                message: 'Conta desativada',
                reactivatable: true,
            });
        };

        req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
        };

        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};

module.exports = authMiddleware;
