// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Rota para o painel do usuário
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { usuario: req.user });
});

// Outras rotas protegidas podem ser adicionadas aqui

module.exports = router;
