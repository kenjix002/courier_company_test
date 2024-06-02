"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Auths",
      [
        {
          id: 1,
          username: "Admin",
          password:
            "$2b$10$.N613z7XUrjRZonDVTJYTOH2C2TyTRGPgOamt4Pj8VCLwOVNGpljG",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          username: "Driver",
          password:
            "$2b$10$.N613z7XUrjRZonDVTJYTOH2C2TyTRGPgOamt4Pj8VCLwOVNGpljG",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Auths", null, {});
  },
};
