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
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      partidosGanados: {
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      partidosPerdidos: {
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      setsGanados: {
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      setsPerdidos: {
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      juegosGanados: {
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      juegosPerdidos: {
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      puntos: {
        type:Sequelize.INTEGER,
        defaultValue:0
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