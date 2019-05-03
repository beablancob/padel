'use strict';
module.exports = (sequelize, DataTypes) => {
  const couplePreviousRound = sequelize.define('couplePreviousRound', {
    round: DataTypes.INTEGER,
    coupleId: DataTypes.INTEGER,
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
    couplePreviousRound.belongsTo(models.couple, {foreignKey: 'coupleId'});
  };
  return couplePreviousRound;
};