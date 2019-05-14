'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail: true,
      unique: true
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    name: DataTypes.STRING,
    apellidos: DataTypes.STRING,

  }, {});
  user.associate = function(models) {
    
    user.hasMany(models.tournament, {
      foreignKey:'adminId'
    });
  };
  return user;
};

