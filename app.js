// app.js
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const db = require('./models');
const Usuario = db.Usuario;

// Body Parser
app.use(express.urlencoded({ extended: false }));
// Configuração da sessão
app.use(
  session({
    secret: 'secret_for_development',
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: db.sequelize,
    }),
  })
);

// Inicialização do Passport
// Configuração do Passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Configuração do connect-flash
app.use(flash());

// Middleware para disponibilizar mensagens flash nas views
app.use((req, res, next) => {
  
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.errors = req.flash('errors');

  console.log('Middleware flash executado, mensagens:', {
    success_msg: res.locals.success_msg,
    error_msg: res.locals.error_msg,
    error: res.locals.error,
    errors: res.locals.errors,
  });

  next();
});

// Middleware para disponibilizar o usuário logado nas views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);


db.sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    return db.sequelize.sync(); 
  })
  .then(() => {
    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ou sincronizar com o banco de dados:', error);
  });
