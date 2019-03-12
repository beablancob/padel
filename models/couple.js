'use strict';
module.exports = (sequelize, DataTypes) => {
  const couple = sequelize.define('couple', {
    idUser1: DataTypes.INTEGER,
    idUser2: DataTypes.INTEGER,
    idTournament: DataTypes.INTEGER
  }, {});
  couple.associate = function(models) {
    // associations can be defined here
  };
  return couple;
};