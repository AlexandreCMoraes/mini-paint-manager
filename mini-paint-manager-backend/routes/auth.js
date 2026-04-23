const express = require('express');
const { register, login, checkEmail, forgotPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/check-email', checkEmail);
router.post('/forgot-password', forgotPassword);

module.exports = router;
