'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

   return queryInterface.bulkInsert('tournaments', 
   [{
     name: 'torneo de test 1',
     adminId: 1,
     numberCouples:6,
     parejasPorGrupo:3,
     puntosPG:2,
     puntosPP:1,
     rondaActual:0,
     idaYvuelta:false,
     numeroRondas:4,
     parejasSuben:2,
     createdAt: new Date(),
     updatedAt: new Date()

    }

   ])
  },

  down: (queryInterface, Sequelize) => {
    
    
      return queryInterface.bulkDelete('tournaments', null, {});
    
  }
};
