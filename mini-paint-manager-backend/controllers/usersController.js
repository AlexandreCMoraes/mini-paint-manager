const usersService = require('../services/usersService');

// Controlador para desativar a conta do usuário autenticado (soft delete). Ele extrai o ID do 
// usuário do objeto req.user, que é preenchido pelo middleware de autenticação, e chama a função
// de serviço para realizar a operação de soft delete. O controlador lida com casos de sucesso, onde
//  a conta é desativada, e casos de erro, como usuário não autenticado ou erros internos. Ele também 
// registra logs detalhados para monitoramento e depuração.
const softDeleteAuthenticatedUser = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    try {
        const updatedUser = await usersService.softDeleteUser(userId);

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado ou já desativado' });
        }

        console.log('[users/me][DELETE] Conta desativada:', {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            deletado_em: updatedUser.deletado_em,
        });

        return res.status(200).json({
            message: 'Conta desativada com sucesso',
        });
    } catch (error) {
        console.error('[users/me][DELETE] Erro ao desativar conta:', error);
        return res.status(500).json({ message: 'Erro interno ao desativar conta' });
    }
};

module.exports = {
    softDeleteAuthenticatedUser,
};
