const express = require('express');
const router = express.Router();
const auth = require('../middlewares/decodeJWT');
const utiController = require('../controllers/utiController');
const { upload } = require('../utils/multer');

router.get('/', auth, utiController.getUtilizadores);
router.get('/:id', auth, utiController.getUtilizador);
router.put('/:id', auth, utiController.editarUtilizador);
router.delete('/:id', auth, utiController.apagarUtilizador);

// Adicionando a nova rota para upload de foto
router.put('/foto', auth, upload.single('foto'), utiController.atualizarFotoUtilizador);

module.exports = router;