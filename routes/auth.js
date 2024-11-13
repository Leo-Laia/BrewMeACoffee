const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Carregar o modelo de Usuário
const db = require('../models');
const Usuario = db.Usuario;

// Rota para a página inicial
router.get('/', (req, res) => {
  res.render('index');
});

// Rota de Registro
router.post('/register', (req, res) => {
  const { nome, telefone, email, senha } = req.body;
  let errors = [];

  
  if (!nome || !email || !senha) {
    errors.push({ msg: 'Por favor, preencha todos os campos obrigatórios' });
  }

  if (senha.length < 6) {
    errors.push({ msg: 'A senha deve ter pelo menos 6 caracteres' });
  }

  if (errors.length > 0) {
    res.render('index', {
      errors,
      nome,
      telefone,
      email,
    });
  } else {
    
    Usuario.findOne({ where: { email } }).then((usuario) => {
      if (usuario) {
        errors.push({ msg: 'Email já está registrado' });
        res.render('index', {
          errors,
          nome,
          telefone,
          email,
        });
      } else {
       
        const novoUsuario = {
          nome,
          telefone,
          email,
          senha,
        };

        // Hash da senha
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
            if (err) throw err;
            // Salvar a senha criptografada
            novoUsuario.senha = hash;

            // Salvar usuário no banco de dados
            Usuario.create(novoUsuario)
              .then(() => {
                req.flash('success_msg', 'Você está registrado e pode fazer login');
                res.redirect('/');
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

// Rota de Login
router.post(
  '/login',
  (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/home',
      failureRedirect: '/',
      failureFlash: true,
    })(req, res, next);
  }
);

// Rota de Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'Você saiu da sua conta');
    res.redirect('/');
  });
});

module.exports = router;