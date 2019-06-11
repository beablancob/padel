'use strict';
module.exports = (sequelize, DataTypes) => {
  const couplePreviousRound = sequelize.define('couplePreviousRound', {
    ronda: DataTypes.INTEGER,
    coupleId: DataTypes.INTEGER,
    tournamentId: DataTypes.INTEGER,
    partidosJugados: DataTypes.INTEGER,
    partidosGanados: DataTypes.INTEGER,
    partidosPerdidos: DataTypes.INTEGER,
    setsGanados: DataTypes.INTEGER,
    setsPerdidos: DataTypes.INTEGER,
    juegosGanados: DataTypes.INTEGER,
    juegosPerdidos: DataTypes.INTEGER,
    puntos: DataTypes.INTEGER,
    grupo: DataTypes.INTEGER,
    diferenciaSets: DataTypes.INTEGER,
    diferenciaJuegos: DataTypes.INTEGER
  }, {});
  couplePreviousRound.associate = function(models) {
    // associations can be defined here

    //Asocio con el id de la pareja 
    couplePreviousRound.belongsTo(models.couple, {foreignKey: 'coupleId'});

    //Asocio con el id torneo
    couplePreviousRound.belongsTo(models.tournament, {foreignKey: 'tournamentId'});

  };
  return couplePreviousRound;
};