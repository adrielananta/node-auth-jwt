'use strict';

const argon2 = require("argon2");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        username: "johndoe",
        firstName: "John",
        lastName: "Doe",
        password: await argon2.hash("password"),
        levelId: 1,
        departmentId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
   
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  }
};
