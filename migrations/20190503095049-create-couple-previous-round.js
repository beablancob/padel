'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('couplePreviousRounds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      round: {
        type: Sequelize.INTEGER
      },
      coupleId: {
        type: Sequelize.INTEGER
      },
      tournamentId: {
        type: Sequelize.INTEGER
      },
      partidosJugados: {
        type: Sequelize.INTEGER
      },
      partidosGanados: {
        type: Sequelize.INTEGER
      },
      partidosPerdidos: {
        type: Sequelize.INTEGER
      },
      setsGanados: {
        type: Sequelize.INTEGER
      },
      setsPerdidos: {
        type: Sequelize.INTEGER
      },
      juegosGanados: {
        type: Sequelize.INTEGER
      },
      juegosPerdidos: {
        type: Sequelize.INTEGER
      },
      puntos: {
        type: Sequelize.INTEGER
      },
      grupo: {
        type: Sequelize.INTEGER
      },
      diferenciaSets: {
        type: Sequelize.INTEGER
      },
      diferenciaJuegos: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('couplePreviousRounds');
  }
};