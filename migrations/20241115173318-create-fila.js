'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Filas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pessoas: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: Sequelize.literal('ARRAY[]::VARCHAR[]')
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      UsuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios', // Nome da tabela de usuários
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Filas');
  }
};
