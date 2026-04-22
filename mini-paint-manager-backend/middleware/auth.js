const jwt = require('jsonwebtoken');

// Middleware de autenticação que verifica a presença e validade do token JWT em cada 
// requisição protegida. Ele extrai o token do cabeçalho Authorization, verifica sua 
// validade usando a chave secreta definida nas variáveis de ambiente, e se o token for 
// válido, adiciona as informações do usuário decodificado ao objeto req para uso posterior 
// nos controladores. Se o token estiver ausente, inválido ou expirado, o middleware 
// retorna uma resposta de erro 401 Unauthorized com uma mensagem apropriada.
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não informado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
