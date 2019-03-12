'use strict';
module.exports = (sequelize, DataTypes) => {
  const tournament = sequelize.define('tournament', {
    name: DataTypes.STRING,
    numberCouples: DataTypes.INTEGER
  }, {});
  tournament.associate = function(models) {
    // associations can be defined here
    tournament.belongsTo(models.user, {foreignKey: 'adminId'});

  };
  return tournament;
};