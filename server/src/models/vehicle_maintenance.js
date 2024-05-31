"use strict";
const { Model } = require("sequelize");
const vehicle = require("./vehicle");
module.exports = (sequelize, DataTypes) => {
  class Vehicle_Maintenance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Vehicle, Maintenance_Detail }) {
      // define association here
      Vehicle_Maintenance.belongsTo(Vehicle, { foreignKey: "vehicle_id" });
      Vehicle_Maintenance.belongsTo(Maintenance_Detail, {
        foreignKey: "maintenance_detail_id",
      });
    }
  }
  Vehicle_Maintenance.init(
    {
      maintenance_detail_id: DataTypes.INTEGER,
      vehicle_id: DataTypes.INTEGER,
      due_schedule: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Vehicle_Maintenance",
    },
  );
  return Vehicle_Maintenance;
};
