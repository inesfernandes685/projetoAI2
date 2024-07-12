const express = require('express');
const router = express.Router();
const auth = require('../middlewares/decodeJWT');
const projetoController = require('../controllers/projetoController');

// Define specific routes before the generic /:id routes
router.post('/aceitar', auth, projetoController.aceitarPartilha); 
router.get('/dados', projetoController.getDadosPorToken);
router.get('/partilhar/:idProjeto',  projetoController.gerarLinkPartilha); 

router.get('/', auth, projetoController.getProjetosToken);
router.post('/', auth, projetoController.criarProjeto);
router.get('/:idUtilizador/projetos',  projetoController.getProjetosUtilizador);
// Generic /:id routes come after specific routes
router.put('/:id', auth, projetoController.atualizarProjeto);
router.delete('/:id', projetoController.apagarProjeto);
router.get('/:id', auth, projetoController.getProjeto);
router.get('/:id/utilizadores', auth, projetoController.utilizadoresProjeto);
router.delete('/:idProjeto/utilizadores/:idUtilizador', auth, projetoController.removerColaborador);

module.exports = router;