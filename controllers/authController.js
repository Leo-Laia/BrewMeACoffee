// controllers/authController.js
const bcrypt = require('bcryptjs');
const passport = require('passport');
const db = require('../models');
const { check, validationResult } = require('express-validator');
const Usuario = db.Usuario;

// Controlador de Registro
exports.registerUser = [
    // Validações usando express-validator
    check('nome', 'Nome é obrigatório').notEmpty(),
    check('email', 'Email inválido').isEmail(),
    check('senha', 'A senha deve ter pelo menos 6 caracteres').isLength({ min: 6 }),
  
    // Controlador após as validações
    (req, res) => {
      const errors = validationResult(req);
      const { nome, telefone, email, senha } = req.body;
  
      if (!errors.isEmpty()) {
        // Mapear os erros para o formato esperado pela view
        const errorArray = errors.array().map(err => ({ msg: err.msg }));
        return res.render('index', {
          errors: errorArray,
          nome,
          telefone,
          registerEmail: email,
          showRegisterModal: true
        });
      }
  
      // Verificar se o usuário já existe
      Usuario.findOne({ where: { email } })
        .then(usuario => {
          if (usuario) {
            // Usuário já existe
            const errorArray = [{ msg: 'Email já está registrado' }];
            return res.render('index', {
              errors: errorArray,
              nome,
              telefone,
              registerEmail: email,
              showRegisterModal: true
            });
          } else {
            // Criar novo usuário
            const novoUsuario = {
              nome,
              telefone,
              email,
              senha,
            };
  
            // Hash da senha
            bcrypt.genSalt(10, (err, salt) => {
              if (err) throw err;
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
                  .catch(err => console.log(err));
              });
            });
          }
        })
        .catch(err => console.log(err));
    }
  ];

  // Controlador de Login
exports.loginUser = (req, res, next) => {
  console.log("controllers/authController.js->loginUser")
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('error_msg', info.message || 'Falha no login');
      const error_msg = req.flash('error_msg');
      return res.render('index', {
        showLoginModal: true,
        loginEmail: req.body.email,
        error_msg
      });
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
};

// Controlador de Logout
exports.logoutUser = (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'Você saiu da sua conta');
    res.redirect('/');
  });
};

