const express = require('express');
const router = express.Router();
const auth = require('../middlewares/decodeJWT');
const utiController = require('../controllers/utiController');

router.get('/', auth, utiController.getUtilizadores);
router.get('/:id', auth, utiController.getUtilizador);
router.put('/:id', auth, utiController.editarUtilizador);
router.delete('/:id', auth, utiController.apagarUtilizador);

module.exports = router;