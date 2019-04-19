'use strict';
module.exports = (sequelize, DataTypes) => {
  const ronda = sequelize.define('ronda', {
    numeroRonda: DataTypes.INTEGER,
    tournamentId:DataTypes.INTEGER
  }, {});
  ronda.associate = function(models) {
    // associations can be defined here
    ronda.belongsTo(models.tournament, {foreignKey: 'tournamentId'});
  };
  return ronda;
};