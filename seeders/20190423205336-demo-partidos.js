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
     jugado:false,
     ganador:2,
     createdAt: new Date(),
     updatedAt: new Date(),
     set1Couple1: 6,
     set2Couple1:4,
     set3Couple1:4,
     set1Couple2: 4,
     set2Couple2:6,
     set3Couple2:6,
     coupleEditedId:1

    },
    {
     tournamentId:1,
     numeroRonda:1,
     numeroGrupo: 0,
     couple1Id:1,
     couple2Id:3,
     jugado:false,
     ganador:3,
     createdAt: new Date(),
     updatedAt: new Date(),
     set1Couple1: 6,
     set2Couple1:4,
     set3Couple1:4,
     set1Couple2: 4,
     set2Couple2:6,
     set3Couple2:6,
     coupleEditedId:1

    },{
    tournamentId:1,
    numeroRonda:1,
    numeroGrupo: 0,
    couple1Id:2,
    couple2Id:3,
    jugado:false,
    ganador:3,
    createdAt: new Date(),
    updatedAt: new Date(),
    set1Couple1: 6,
     set2Couple1:4,
     set3Couple1:4,
     set1Couple2: 4,
     set2Couple2:6,
     set3Couple2:6,
     coupleEditedId:2

   },{
   tournamentId:1,
   numeroRonda:1,
   numeroGrupo: 1,
   couple1Id:4,
   couple2Id:5,
   jugado:false,
   ganador:5,
   createdAt: new Date(),
   updatedAt: new Date(),
   set1Couple1: 6,
     set2Couple1:4,
     set3Couple1:4,
     set1Couple2: 4,
     set2Couple2:6,
     set3Couple2:6,
     coupleEditedId:4

  },
  {
    tournamentId:1,
    numeroRonda:1,
    numeroGrupo: 1,
    couple1Id:4,
    couple2Id:6,
    jugado:false,
    ganador:6,
    createdAt: new Date(),
    updatedAt: new Date(),
    set1Couple1: 6,
     set2Couple1:4,
     set3Couple1:4,
     set1Couple2: 4,
     set2Couple2:6,
     set3Couple2:6,
     coupleEditedId:4
 
   },
   {
    tournamentId:1,
    numeroRonda:1,
    numeroGrupo: 1,
    couple1Id:5,
    couple2Id:6,
    jugado:false,
    ganador:6,
    createdAt: new Date(),
    updatedAt: new Date(),
    set1Couple1: 6,
    set2Couple1:4,
    set3Couple1:4,
    set1Couple2: 4,
    set2Couple2:6,
    set3Couple2:6,
    coupleEditedId:5
 
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
