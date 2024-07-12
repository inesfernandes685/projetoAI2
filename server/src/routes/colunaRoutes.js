const ColunaController = require('../controllers/colunaController');
const express = require('express');
const router = express.Router();

router.get('/:id', ColunaController.getColunasProjeto);
router.delete('/:id', ColunaController.apagarColuna);
router.put('/:id', ColunaController.atualizarColuna);
router.post('/', ColunaController.criarColuna);

module.exports = router;