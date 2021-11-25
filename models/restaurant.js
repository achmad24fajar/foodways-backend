'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Restaurant.belongsTo(models.User, {
        foreignKey: 'userId',
      });
    }
  }
  Restaurant.init(
    {
      restaurant_name: DataTypes.STRING,
      open: DataTypes.STRING,
      close: DataTypes.STRING,
      email: DataTypes.STRING,
      telephone: DataTypes.STRING,
      address: DataTypes.GEOMETRY,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Restaurant',
    }
  );
  return Restaurant;
};
