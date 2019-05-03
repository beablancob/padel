'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('partidos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tournamentId: {
        type: Sequelize.INTEGER
      },
      numeroRonda: {
        type: Sequelize.INTEGER
      },
      numeroGrupo: {
        type: Sequelize.INTEGER
      },
      couple1Id: {
        type: Sequelize.INTEGER
      },
      couple2Id: {
        type: Sequelize.INTEGER
      },
      jugado: {
        type: Sequelize.BOOLEAN
      },
      ganador: {
        type: Sequelize.INTEGER
      },
      set1Couple1: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      set2Couple1: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      set3Couple1: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      set1Couple2: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      set2Couple2: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      set3Couple2: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('partidos');
  }
};