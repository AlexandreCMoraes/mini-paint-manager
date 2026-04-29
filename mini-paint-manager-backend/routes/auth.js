const express = require('express');
const { register, login, checkEmail, forgotPassword, requestReactivation } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/check-email', checkEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reactivate-request', requestReactivation);
router.post('/reactivation-request', requestReactivation);

module.exports = router;
