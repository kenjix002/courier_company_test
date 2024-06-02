"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Vehicle_Types",
      [
        {
          id: 1,
          brand: "Daihatsu",
          model: "Hijet",
          type: "TRUCK",
          availability: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          brand: "Daihatsu",
          model: "Gran Max",
          type: "VAN",
          availability: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          brand: "Hino",
          model: "300",
          type: "TRUCK",
          availability: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Vehicle_Types", null, {});
  },
};
