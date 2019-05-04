'use strict';
 
const faker = require("faker");
 let users = [{
     id: 14,
     username: "testuser",
     email: faker.internet.email(),
     password: "11106",
     createdAt: new Date(),
     updatedAt: new Date(),
     role: "standard"
     },
];
 
module.exports = {
  up: (queryInterface, Sequelize) => {
       return queryInterface.bulkInsert("Users", users, {});
  },
   down: (queryInterface, Sequelize) => {
       return queryInterface.bulkDelete("Users", null, {});
  }
}; 