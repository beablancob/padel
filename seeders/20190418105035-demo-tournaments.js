'use strict';
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');

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
     name: 'Torneo de la ETSIT',
     adminId: 1,
     numeroParejas:6,
     parejasPorGrupo:3,
     puntosPG:3,
     puntosPP:1,
     rondaActual:1,
     publico:true,
     idaYvuelta:false,
     numeroRondas:8,
     parejasSuben:1,
     registerCode:uuidv4(),
     createdAt: new Date(),
     updatedAt: new Date()

    }

   ])
  },

  down: (queryInterface, Sequelize) => {
    
    
      return queryInterface.bulkDelete('tournaments', null, {});
    
  }
};


// 'use strict';

// module.exports = {
//   up: function(queryInterface, Sequelize) {
//     return Promise.resolve()
//   },

//   down: function(queryInterface) {
//     return Promise.resolve()
//   }
// };