'use strict';
module.exports = (sequelize, DataTypes) => {
  const partido = sequelize.define('partido', {
    tournamentId: DataTypes.INTEGER,
    numeroRonda: DataTypes.INTEGER,
    numeroGrupo: DataTypes.INTEGER,
    couple1Id: DataTypes.INTEGER,
    couple2Id: DataTypes.INTEGER,
    jugado: DataTypes.BOOLEAN,
    ganador: DataTypes.INTEGER,
    set1Couple1: DataTypes.INTEGER,
    set2Couple1: DataTypes.INTEGER,
    set3Couple1: DataTypes.INTEGER,
    set1Couple2: DataTypes.INTEGER,
    set2Couple2: DataTypes.INTEGER,
    set3Couple2: DataTypes.INTEGER,
    parejaEditedId: DataTypes.INTEGER


  }, {});
  partido.associate = function(models) {
    // associations can be defined here
    partido.belongsTo(models.tournament, {foreignKey: 'tournamentId'});
  };
  return partido;
};