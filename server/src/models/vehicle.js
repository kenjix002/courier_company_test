"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Vehicle_Type }) {
      // define association here
      Vehicle.belongsTo(User, { foreignKey: "user_id" });
      Vehicle.belongsTo(Vehicle_Type, { foreignKey: "vehicle_type_id" });
    }
  }
  Vehicle.init(
    {
      user_id: DataTypes.INTEGER,
      vehicle_type_id: DataTypes.INTEGER,
      registry: DataTypes.STRING,
      start_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Vehicle",
    },
  );
  return Vehicle;
};
