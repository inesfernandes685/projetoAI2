const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/decodeJWT');

router.get('/utilizador', auth, authController.getUtilizador);
router.get('/utilizador-completo', auth, authController.getUtilizadorCompleto);
router.post('/login', authController.login);
router.post('/criar-conta', authController.criarConta);
router.post('/verificar-email', authController.verificarEmail);
router.post('/recuperar-passe', authController.recuperarPasse);
router.post('/nova-passe', authController.novaPasse);

module.exports = router;