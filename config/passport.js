const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Carregar o modelo de Usuário
const db = require('../models');
const Usuario = db.Usuario;

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, senha, done) => {
      // Procurar usuário pelo email
      Usuario.findOne({ where: { email } })
        .then((usuario) => {
          if (!usuario) {
            return done(null, false, { message: 'Email não registrado' });
          }

          // Comparar a senha
          bcrypt.compare(senha, usuario.senha, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, usuario);
            } else {
              return done(null, false, { message: 'Senha incorreta' });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );

  // Serializar e desserializar o usuário
  passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
  });

  passport.deserializeUser((id, done) => {
    Usuario.findByPk(id)
      .then((usuario) => {
        done(null, usuario);
      })
      .catch((err) => done(err, null));
  });
};
