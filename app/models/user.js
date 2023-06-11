'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Level, {
        foreignKey: "levelId",
        onDelete: "CASCADE"
      });
      User.belongsTo(models.Department, {
        foreignKey: "departmentId",
        onDelete: "CASCADE"
      });
      User.hasMany(models.RefreshToken, {
        foreignKey: "userId"
      });
    };
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING,
    levelId: DataTypes.INTEGER,
    departmentId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};