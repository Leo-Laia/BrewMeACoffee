// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para a página inicial
router.get('/', (req, res) => {
  res.render('index');
});

// Rota de Registro
router.post('/register', authController.registerUser);

// Rota de Login
router.post('/login', authController.loginUser);

// Rota de Logout
router.get('/logout', authController.logoutUser);

module.exports = router;
