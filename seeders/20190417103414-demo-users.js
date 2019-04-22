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
   [{
     email: 'test1@test.com',
     password: bcrypt.hashSync('password',10),
     name:'test1',
     createdAt: new Date(),
     updatedAt: new Date()

    },
    {
      email: 'test2@test.com',
      password: bcrypt.hashSync('password',10),
      name:'test2',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'test3@test.com',
      password: bcrypt.hashSync('password',10),
      name:'test4',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'test4@test.com',
      password: bcrypt.hashSync('password',10),
      name:'test4',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'test5@test.com',
      password: bcrypt.hashSync('password',10),
      name:'test5',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'test6@test.com',
      password: bcrypt.hashSync('password',10),
      name:'test6',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'test7@test.com',
      password: bcrypt.hashSync('password',10),
      name:'test1',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'test8@test.com',
      password: bcrypt.hashSync('password',10),
      name:'test8',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'test9@test.com',
      password: bcrypt.hashSync('password',10),
      name:'test9',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'test10@test.com',
      password: bcrypt.hashSync('password',10),
      name:'test10',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'test11@test.com',
      password: bcrypt.hashSync('password',10),
      name:'test11',
      createdAt: new Date(),
      updatedAt: new Date()
 
     },
     {
      email: 'test12@test.com',
      password: bcrypt.hashSync('password',10),
      name:'test12',
      createdAt: new Date(),
      updatedAt: new Date()
 
     }

   ])
  },

  down: (queryInterface, Sequelize) => {
    
    
      return queryInterface.bulkDelete('users', null, {});
    
  }
};
