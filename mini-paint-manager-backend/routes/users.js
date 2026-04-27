const express = require('express');
const authMiddleware = require('../middleware/auth');
const { softDeleteAuthenticatedUser } = require('../controllers/usersController');

const router = express.Router();

router.delete('/me', authMiddleware, softDeleteAuthenticatedUser);

module.exports = router;
