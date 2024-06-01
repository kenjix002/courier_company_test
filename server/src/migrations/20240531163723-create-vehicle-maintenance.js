"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Vehicle_Maintenances", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      maintenance_type_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Maintenance_Types",
          key: "id",
        },
      },
      vehicle_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Vehicles",
          key: "id",
        },
      },
      due_schedule: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Vehicle_Maintenances");
  },
};
