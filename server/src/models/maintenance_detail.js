"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Maintenance_Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Maintenance_Detail.init(
    {
      type: DataTypes.STRING,
      priority: DataTypes.STRING,
      periodic_maintenance_month: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Maintenance_Detail",
    },
  );
  return Maintenance_Detail;
};
