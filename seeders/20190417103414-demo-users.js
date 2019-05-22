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

   return queryInterface.bulkInsert('users', 
   [
     {
     email: 'jorge@test.com',
     password: bcrypt.hashSync('qwerty',10),
     name:'Jorge',
     lastname:'García Pérez',
     createdAt: new Date(),
     updatedAt: new Date()

    },
    {
      email: 'juan@test.com',
      password: bcrypt.hashSync('password',10),
      name:'Juan',
      lastname: 'Ortiz Gómez',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'pablo@test.com',
      password: bcrypt.hashSync('password',10),
      name:'Pablo',
      lastname: 'Romero Sánchez',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'santiago@test.com',
      password: bcrypt.hashSync('password',10),
      name:'Santiago',
      lastname:'Lara Gómez',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'camilo@test.com',
      password: bcrypt.hashSync('password',10),
      name:'Camilo',
      lastname:'Valdés Ortega',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'mario@test.com',
      password: bcrypt.hashSync('password',10),
      name:'Mario',
      lastname:'Acosta Alonso',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'belen@test.com',
      password: bcrypt.hashSync('password',10),
      name:'Belén',
      lastname:'Casto Espejo',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'marta@test.com',
      password: bcrypt.hashSync('password',10),
      name:'Marta',
      lastname:'Cuevas Muñoz',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'sara@test.com',
      password: bcrypt.hashSync('password',10),
      name:'Sara',
      lastname:'Crespo Collado',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'alvaro@test.com',
      password: bcrypt.hashSync('password',10),
      name:'Álvaro',
      lastname:'Castañeda Turga',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'irene@test.com',
      password: bcrypt.hashSync('password',10),
      name:'Irene',
      lastname:'Fernández Quintana',
      createdAt: new Date(),
      updatedAt: new Date()
 
     }
     ,
     {
      email: 'francisco@test.com',
      password: bcrypt.hashSync('password',10),
      name:'Francisco',
      lastname:'Notario Ayuso',
      createdAt: new Date(),
      updatedAt: new Date()
 
     }

   ])
  },

  down: (queryInterface, Sequelize) => {
    
    
      return queryInterface.bulkDelete('users', null, {});
    
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