"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Maintenance_Types",
      [
        {
          id: 1,
          type: "Oils",
          priority: "HIGH",
          periodic_maintenance_month: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          type: "Break fluid",
          priority: "HIGH",
          periodic_maintenance_month: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          type: "Tire Pressure",
          priority: "MEDIUM",
          periodic_maintenance_month: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          type: "LIGHT",
          priority: "HIGH",
          periodic_maintenance_month: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          type: "Wheel alignment",
          priority: "LOW",
          periodic_maintenance_month: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Maintenance_Types", null, {});
  },
};
