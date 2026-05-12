// MAPA DE ROTAS: Define as URLs disponíveis para miniaturas (GET, POST, PUT, DELETE) e
//  direciona para o Controller.

const express = require('express');
// Middleware de autenticação para proteger as rotas de miniaturas
const authMiddleware = require('../middleware/auth');
const {
  listMiniatures,
  searchMiniatures,
  createMiniature,
  deleteMiniature,
  updateMiniature,
} = require('../controllers/miniaturesController');

const router = express.Router();

// Todas as rotas de miniaturas são protegidas por autenticação e
// operam apenas sobre os dados do usuário autenticado.
router.use(authMiddleware);
router.get('/', listMiniatures);
router.get('/search', searchMiniatures);
router.post('/', createMiniature);
router.delete('/:id', deleteMiniature);
router.put('/:id', updateMiniature);

module.exports = router;