'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    
   return queryInterface.bulkInsert('partidos', 
   [{
     tournamentId:1,
     numeroRonda:1,
     numeroGrupo: 0,
     couple1Id:1,
     couple2Id:2,
     jugado:true,
     ganador:1,
     createdAt: new Date(),
     updatedAt: new Date()

    },
    {
     tournamentId:1,
     numeroRonda:1,
     numeroGrupo: 0,
     couple1Id:1,
     couple2Id:3,
     jugado:true,
     ganador:3,
     createdAt: new Date(),
     updatedAt: new Date()

    },{
    tournamentId:1,
    numeroRonda:1,
    numeroGrupo: 0,
    couple1Id:2,
    couple2Id:3,
    jugado:true,
    ganador:2,
    createdAt: new Date(),
    updatedAt: new Date()

   },{
   tournamentId:1,
   numeroRonda:1,
   numeroGrupo: 1,
   couple1Id:4,
   couple2Id:5,
   jugado:true,
   ganador:4,
   createdAt: new Date(),
   updatedAt: new Date()

  },
  {
    tournamentId:1,
    numeroRonda:1,
    numeroGrupo: 1,
    couple1Id:4,
    couple2Id:6,
    jugado:true,
    ganador:4,
    createdAt: new Date(),
    updatedAt: new Date()
 
   },
   {
    tournamentId:1,
    numeroRonda:1,
    numeroGrupo: 1,
    couple1Id:5,
    couple2Id:6,
    jugado:true,
    ganador:5,
    createdAt: new Date(),
    updatedAt: new Date()
 
   }


   ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
