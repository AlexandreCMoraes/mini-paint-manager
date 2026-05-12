const usersRepository = require('../repositories/usersRepository');

const getUserActiveStatus = async (userId) => usersRepository.findActiveStatusById(userId);

const softDeleteUser = async (userId) => usersRepository.softDeleteById(userId);

module.exports = {
    getUserActiveStatus,
    softDeleteUser,
};
