'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fila extends Model {
    static associate(models) {
      // Associação com o usuário
      Fila.belongsTo(models.Usuario, {
        foreignKey: 'UsuarioId',
        as: 'usuario'
      });
    }
  }
  Fila.init(
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      pessoas: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      UsuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Fila',
    }
  );
  return Fila;
};
