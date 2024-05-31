"use strict";
const { Model } = require("sequelize");
const { FOREIGNKEYS } = require("sequelize/lib/query-types");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Auth }) {
      // define association here
      User.belongsTo(Auth, { foreignKey: "auth_id" });
    }
  }
  User.init(
    {
      role: DataTypes.STRING,
      client: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      auth_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
