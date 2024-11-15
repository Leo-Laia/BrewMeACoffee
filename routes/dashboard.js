// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const filaController = require('../controllers/filaController');

// Rota para o painel do usuário
//router.get('/', ensureAuthenticated, (req, res) => {
//  res.render('dashboard', { usuario: req.user }, filaController.listarFilas);
//});

// Listar filas (Dashboard)
router.get('/', ensureAuthenticated, filaController.listarFilas);

// Criar uma nova fila
router.post('/filas', ensureAuthenticated, filaController.criarFila);

// Atualizar uma fila
router.post('/filas/:id', ensureAuthenticated, filaController.atualizarFila);

// Deletar uma fila
router.post('/filas/:id/delete', ensureAuthenticated, filaController.deletarFila);

module.exports = router;
