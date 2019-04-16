'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tournaments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      numberCouples: {
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
      adminId: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      puntosPG: {type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      puntosPP: {type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0
      },
      rondaActual:{type: Sequelize.INTEGER,
        defaultValue: 0
      }, 
      idaYvuelta: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
    
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tournaments');
  }
};