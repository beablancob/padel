'use strict';
module.exports = (sequelize, DataTypes) => {
  const partido = sequelize.define('partido', {
    tournamentId: DataTypes.INTEGER,
    numeroRonda: DataTypes.INTEGER,
    numeroGrupo: DataTypes.INTEGER,
    couple1Id: DataTypes.INTEGER,
    couple2Id: DataTypes.INTEGER,
    jugado: DataTypes.BOOLEAN,
    ganador: DataTypes.INTEGER
  }, {});
  partido.associate = function(models) {
    // associations can be defined here
    partido.belongsTo(models.tournament, {foreignKey: 'tournamentId'});
  };
  return partido;
};