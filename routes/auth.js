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
  console.log("routes/auth.js->register")
  const { nome, telefone, email, senha } = req.body;
  let errors = [];

  
  if (!nome || !email || !senha) {
    errors.push({ msg: 'Por favor, preencha todos os campos obrigatórios' });
  }

  if (senha.length < 6) {
    console.log("Senha invalida")
    errors.push({ msg: 'A senha deve ter pelo menos 6 caracteres' });
  }

  if (errors.length > 0) {
    res.render('index', {
      errors,
      nome,
      telefone,
      email,
      showRegisterModal: true
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
router.post('/login', (req, res, next) => {
  console.log("routes/auth.js->login")
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      // Define a mensagem flash
      req.flash('error_msg', info.message || 'Falha no login');
      // Recupera a mensagem flash imediatamente
      const error_msg = req.flash('error_msg');
      return res.render('index', {
        showLoginModal: true,
        email: req.body.email, // Passa o email de volta para a view
        error_msg // Passa a mensagem de erro para a view
      });
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/home');
    });
  })(req, res, next);
});



// Rota de Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'Ei volte mais vezes!');
    res.redirect('/');
  });
});

module.exports = router;