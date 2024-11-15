const db = require('../models');
const Fila = db.Fila;

// Listar todas as filas de um usuário
exports.listarFilas = async (req, res) => {
  try {
    const filas = await Fila.findAll({
      where: { UsuarioId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.render('dashboard', { filas, usuario: req.user });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Erro ao carregar filas');
    res.redirect('/dashboard');
  }
};

// Criar uma nova fila
exports.criarFila = async (req, res) => {
  const { nome, url, pessoas } = req.body;

  try {
    await Fila.create({
      nome,
      url,
      pessoas: pessoas ? pessoas.split(',') : [],
      UsuarioId: req.user.id
    });
    req.flash('success_msg', 'Fila criada com sucesso');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Erro ao criar fila');
    res.redirect('/dashboard');
  }
};

// Atualizar uma fila existente
/*exports.atualizarFila = async (req, res) => {
  const { id } = req.params;
  const { nome, url, pessoas } = req.body;

  try {
    await Fila.update(
      { nome, url, pessoas: pessoas.split(',') },
      { where: { id, UsuarioId: req.user.id } }
    );
    req.flash('success_msg', 'Fila atualizada com sucesso');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Erro ao atualizar fila');
    res.redirect('/dashboard');
  }
};*/

exports.atualizarFila = async (req, res) => {
  const { id } = req.params;
  const { nome, url, pessoas } = req.body;

  try {
    await Fila.update(
      {
        nome,
        url,
        pessoas: pessoas.split(',').map(p => p.trim()), // Dividir e limpar a lista de pessoas
      },
      { where: { id, UsuarioId: req.user.id } } // Atualizar apenas as filas do usuário logado
    );

    req.flash('success_msg', 'Fila atualizada com sucesso');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Erro ao atualizar fila');
    res.redirect('/dashboard');
  }
};

// Deletar uma fila
exports.deletarFila = async (req, res) => {
  const { id } = req.params;

  try {
    await Fila.destroy({ where: { id, UsuarioId: req.user.id } });
    req.flash('success_msg', 'Fila deletada com sucesso');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Erro ao deletar fila');
    res.redirect('/dashboard');
  }
};
