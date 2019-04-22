'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('couples', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user1Id: {
        type: Sequelize.INTEGER
      },
      user2Id: {
        type: Sequelize.INTEGER
      },
      tournamentId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      partidosJugados: {
        type:Sequelize.INTEGER
      },
      partidosGanados: {
        type:Sequelize.INTEGER
      },
      partidosPerdidos: {
        type:Sequelize.INTEGER
      },
      setsGanados: {
        type:Sequelize.INTEGER
      },
      setsPerdidos: {
        type:Sequelize.INTEGER
      },
      juegosGanados: {
        type:Sequelize.INTEGER
      },
      juegosPerdidos: {
        type:Sequelize.INTEGER
      },
      puntos: {
        type:Sequelize.INTEGER
      },
      grupoActual: {
        type:Sequelize.INTEGER
      }




    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('couples');
  }
};