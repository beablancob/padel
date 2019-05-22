const uuidv4 = require('uuid/v4');
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
      adminId: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      numeroParejas: {
        type: Sequelize.INTEGER
      },
      parejasPorGrupo: {
        type: Sequelize.INTEGER,
        defaultValue:2
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
      },
      publico: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      numeroRondas: {
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      parejasSuben: {
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      registerCode: {
        type:Sequelize.UUID,
        defaultValue:uuidv4(),
        unique:true
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
    return queryInterface.dropTable('tournaments');
  }
};