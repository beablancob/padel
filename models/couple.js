'use strict';
module.exports = (sequelize, DataTypes) => {
  const couple = sequelize.define('couple', {
    user1Id: DataTypes.INTEGER,
    user2Id: DataTypes.INTEGER,
    tournamentId: DataTypes.INTEGER
  }, {});
  couple.associate = function(models) {
    // associations can be defined here
    couple.belongsTo(models.tournament, {foreignKey: 'tournamentId'});
  };
  return couple;
};