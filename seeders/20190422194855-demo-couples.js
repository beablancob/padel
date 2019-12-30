'use strict';

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

   return queryInterface.bulkInsert('couples', 
    [
    {
     user1Id:1,
     user2Id:2,
     grupoActual:0,
     tournamentId: 1,
     createdAt: new Date(),
     updatedAt: new Date()
     

    },
    {
      user1Id:3,
      user2Id:4,
      tournamentId: 1,
      grupoActual:0,
      createdAt: new Date(),
      updatedAt: new Date()
     
 
     },
     {
      user1Id:5,
      user2Id:6,
      grupoActual:0,
      tournamentId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      user1Id:7,
      user2Id:8,
      tournamentId: 1,
      grupoActual:1,
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      user1Id:9,
      user2Id:10,
      tournamentId: 1,
      grupoActual:1,
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      user1Id:11,
      user2Id:12,
      tournamentId: 1,
      grupoActual:1,
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

// 'use strict';

// module.exports = {
//   up: function(queryInterface, Sequelize) {
//     return Promise.resolve()
//   },

//   down: function(queryInterface) {
//     return Promise.resolve()
//   }
// };