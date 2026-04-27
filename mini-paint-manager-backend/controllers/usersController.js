const pool = require('../db');

// Soft delete do usuário autenticado (desativação da conta)
const softDeleteAuthenticatedUser = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    try {
        const result = await pool.query(
            `UPDATE users
       SET ativo = false,
           deletado_em = NOW()
       WHERE id = $1 AND ativo = true
       RETURNING id, username, email, ativo, deletado_em`,
            [userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado ou já desativado' });
        }

        // Log do usuário desativado
        const updatedUser = result.rows[0];
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
