const NotaController = require('../controllers/notaController');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/decodeJWT');

router.get('/projeto/:id', NotaController.getNotasProjeto);
router.delete('/:id', auth, NotaController.apagarNota);
router.put('/:id', auth, NotaController.atualizarNota);
router.post('/', auth, NotaController.criarNota);
router.get('/', auth, NotaController.getTodasNotas);
router.get('/utilizador', auth, NotaController.getNotasUtilizador)


module.exports = router;
