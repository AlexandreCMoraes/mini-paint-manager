// FILTRO DE AUTENTICAÇÃO: Valida o token JWT em requisições protegidas, checa se o 
// usuário está ativo no banco e injeta os dados em 'req.user'.

const jwt = require('jsonwebtoken');
const pool = require('../db');

// Middleware de autenticação que verifica a presença e validade do token JWT em cada 
// requisição protegida. Ele extrai o token do cabeçalho Authorization, verifica sua 
// validade usando a chave secreta definida nas variáveis de ambiente, e se o token for 
// válido, adiciona as informações do usuário decodificado ao objeto req para uso posterior 
// nos controladores. Se o token estiver ausente, inválido ou expirado, o middleware 
// retorna uma resposta de erro 401 Unauthorized com uma mensagem apropriada.
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não informado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Verificar se o usuário associado ao token ainda está ativo no banco de dados 
        // (ou seja, não foi desativado ou deletado)
        const userStatusResult = await pool.query(
            'SELECT ativo FROM users WHERE id = $1 LIMIT 1',
            [decoded.id]
        );

        if (userStatusResult.rowCount === 0) {
            return res.status(401).json({ message: 'Usuário do token não encontrado' });
        }

        const tokenUser = userStatusResult.rows[0];

        if (!tokenUser.ativo) {
            return res.status(403).json({
                message: 'Conta desativada',
                reactivatable: true,
            });
        }
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
